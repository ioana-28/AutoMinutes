import { FC, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StateMessage from '@atoms/StateMessage/StateMessage';
import AttendeesListPopup from '@organisms/AttendeesListPopup/AttendeesListPopup';
import MeetingDeleteDialog from '@organisms/MeetingDeleteDialog/MeetingDeleteDialog';
import MeetingDetailsTemplate from '@templates/MeetingDetailsTemplate/MeetingDetailsTemplate';
import {
  deleteMeeting,
  getMeeting,
  MeetingApiResponse,
  updateMeetingDate,
  updateMeetingTitle,
} from '@/api/meetingApi';
import ActionItemPopup from '@organisms/ActionItemPopup/ActionItemPopup';

import {
  getAllActionItems,
  createActionItem,
  updateActionItem,
  deleteActionItem,
} from '@/api/ActionItemApi';
import useMeetingDetails from '@/hooks/useMeetingDetails';
import useMeetingParticipants from '@/hooks/useMeetingParticipants';

const MeetingDetailsPage: FC = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const resolvedId = Number(meetingId);
  const isInvalidId = Number.isNaN(resolvedId);

  const deleteDialogOpenRef = useRef<() => void>(() => undefined);
//
  const [isActionPopupOpen, setIsActionPopupOpen] =useState(false);
  const [items, setItems] = useState([]);

  const meetingTitle = useMemo(() => meeting?.title?.trim() || 'Meeting', [meeting]);
  const meetingDateLabel = useMemo(() => {
    if (!meeting?.meetingDate) {
      return 'No date';
    }
    const parsed = new Date(`${meeting.meetingDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return 'No date';
    }
    return parsed.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, [meeting]);

  const loadActionItems = async () => {
    try {
      const data =
        await getAllActionItems();

      setItems(data);

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (isInvalidId) {
      return;
    }

    const controller = new AbortController();

    const fetchMeeting = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMeeting(resolvedId, controller.signal);
        setMeeting(data);
        setDraftTitle(data.title?.trim() || '');
        setDraftDate(data.meetingDate ?? '');
        await loadActionItems();

      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError('Unable to load meeting.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeeting();

    return () => controller.abort();
  }, [resolvedId, isInvalidId]);

  const handleSave = async () => {
    if (!meeting) {
      return;
    }

    const nextTitle = draftTitle.trim();
    if (!nextTitle) {
      setError('Meeting title is required.');
      return;
    }

    const nextDate = draftDate.trim();
    const titleChanged = nextTitle !== (meeting.title?.trim() || '');
    const dateChanged = Boolean(nextDate && nextDate !== (meeting.meetingDate ?? ''));

    if (!titleChanged && !dateChanged) {
      setIsEditingTitle(false);
      return;
    }

    try {
      setIsSaving(true);
      if (titleChanged) {
        await updateMeetingTitle(meeting.id, nextTitle);
      }
      if (dateChanged) {
        await updateMeetingDate(meeting.id, nextDate);
      }
      setMeeting({
        ...meeting,
        title: nextTitle,
        meetingDate: nextDate || meeting.meetingDate,
      });
      setIsEditingTitle(false);
    } catch {
      setError('Unable to save meeting changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!meeting) {
      return;
    }

    try {
      setIsSaving(true);
      setDeleteError(null);
      await deleteMeeting(meeting.id);
      navigate('/meeting-list');
    } catch {
      setDeleteError('Unable to delete meeting.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveActionItem =
    async (payload: any) => {
      try {

        if (payload.id === 0) {

          await createActionItem(
            payload,
            resolvedId
          );

        } else {

          await updateActionItem(
            payload.id,
            payload
          );

        }

        await loadActionItems();

      } catch (error) {
        console.error(error);
      }
    };

  const handleDeleteActionItem =
    async (id: number) => {
      try {

        await deleteActionItem(id);
        await loadActionItems();

      } catch (error) {
        console.error(error);
      }
    };

  const { popupProps: participantsPopupProps, openPopup } = useMeetingParticipants(
    isInvalidId ? null : resolvedId,
  );
  const {
    meeting,
    meetingTitle,
    meetingDateLabel,
    draftTitle,
    draftDate,
    isEditingTitle,
    isLoading,
    isSaving,
    error,
    deleteError,
    setDraftTitle,
    setDraftDate,
    toggleEditTitle,
    onSave,
    onDelete,
  } = useMeetingDetails(isInvalidId ? null : resolvedId, {
    onDeleted: () => navigate('/meeting-list'),
  });

  const canEdit = Boolean(meeting) && !isLoading && !isInvalidId && !error;
  const displayTitle = isLoading ? 'Loading...' : meetingTitle;
  const displayDateLabel = canEdit ? meetingDateLabel : '';
  const displayIsEditing = canEdit ? isEditingTitle : false;

  const registerDeleteOpen = useCallback((open: () => void) => {
    deleteDialogOpenRef.current = open;
  }, []);

  const handleOpenDelete = () => {
    if (!meeting) {
      return;
    }
    deleteDialogOpenRef.current();
  };

  const content = isLoading ? (
    <StateMessage variant="loading" message="Loading meeting..." />
  ) : isInvalidId ? (
    <StateMessage variant="error" message="Invalid meeting id." />
  ) : error ? (
    <StateMessage variant="error" message={error} />
  ) : null;

  return (
    <MeetingDetailsTemplate
      meetingTitle={displayTitle}
      meetingDateLabel={displayDateLabel}
      isEditingTitle={displayIsEditing}
      editTitleValue={canEdit ? draftTitle : ''}
      editDateValue={canEdit ? draftDate : ''}
      isSaving={isSaving}
      onEditTitleValueChange={canEdit ? setDraftTitle : () => undefined}
      onEditDateValueChange={canEdit ? setDraftDate : () => undefined}
      onToggleEditTitle={canEdit ? toggleEditTitle : () => undefined}
      onSave={canEdit ? onSave : () => undefined}
      onDelete={canEdit ? handleOpenDelete : () => undefined}
      onClose={() => navigate('/meeting-list')}
      onParticipants={() => undefined}
      //onActionItems={() => undefined}
      onActionItems={() => setIsActionPopupOpen(true)
}
      onParticipants={openPopup}
      onActionItems={() => undefined}
    >
      {content}
      <AttendeesListPopup {...participantsPopupProps} />
      <MeetingDeleteDialog
        isSaving={isSaving}
        error={deleteError}
        onConfirm={onDelete}
        registerOpen={registerDeleteOpen}
      />
      
      <ActionItemPopup
        items={items}
        isOpen={isActionPopupOpen}
        onClose={() =>
          setIsActionPopupOpen(false)
        }
        onDelete={handleDeleteActionItem}
        onSave={handleSaveActionItem}
      />
    </MeetingDetailsTemplate>
  );
};

export default MeetingDetailsPage;
