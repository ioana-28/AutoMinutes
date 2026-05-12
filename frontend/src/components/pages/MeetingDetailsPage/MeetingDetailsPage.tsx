import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StateMessage from '@atoms/StateMessage/StateMessage';
import MeetingDeleteDialog from '@organisms/MeetingDeleteDialog/MeetingDeleteDialog';
import MeetingDetailsTemplate from '@templates/MeetingDetailsTemplate/MeetingDetailsTemplate';
import {
  deleteMeeting,
  getMeeting,
  MeetingApiResponse,
  updateMeetingDate,
  updateMeetingTitle,
} from '@/api/meetingApi';
//
import ActionItemPopup from '@organisms/ActionItemPopup/ActionItemPopup';
const MeetingDetailsPage: FC = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const resolvedId = Number(meetingId);
  const isInvalidId = Number.isNaN(resolvedId);

  const [meeting, setMeeting] = useState<MeetingApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDate, setDraftDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const deleteDialogOpenRef = useRef<() => void>(() => undefined);
//
  const [isActionPopupOpen, setIsActionPopupOpen] =useState(false);
  const [items, setItems] = useState([
  {
    id: 1,
    description: 'DESCRIERE NOUA',
    deadline: 'miercuri',
    status: 'pending',
  },
]);
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
  //
  const handleSaveActionItem = (
    payload: any
  ) => {
    if (payload.id === 0) {
      setItems((prev) => [
        ...prev,
        {
          ...payload,
          id: Date.now(),
        },
      ]);

      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === payload.id
          ? payload
          : item
      )
    );
  };
  const handleDeleteActionItem = (
    id: number
  ) => {
    setItems((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };
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
      onToggleEditTitle={canEdit ? () => setIsEditingTitle((prev) => !prev) : () => undefined}
      onSave={canEdit ? handleSave : () => undefined}
      onDelete={canEdit ? handleOpenDelete : () => undefined}
      onClose={() => navigate('/meeting-list')}
      onParticipants={() => undefined}
      //onActionItems={() => undefined}
      onActionItems={() => setIsActionPopupOpen(true)
}
    >
      {content}
      <MeetingDeleteDialog
        isSaving={isSaving}
        error={deleteError}
        onConfirm={handleDelete}
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
