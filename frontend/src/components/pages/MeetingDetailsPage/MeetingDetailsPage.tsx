import { FC, useCallback, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StateMessage from '@atoms/StateMessage/StateMessage';
import AttendeesListPopup from '@organisms/AttendeesListPopup/AttendeesListPopup';
import MeetingDeleteDialog from '@organisms/MeetingDeleteDialog/MeetingDeleteDialog';
import MeetingDetailsTemplate from '@templates/MeetingDetailsTemplate/MeetingDetailsTemplate';
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

  const [isActionPopupOpen, setIsActionPopupOpen] = useState(false);
  const [items, setItems] = useState([]);

  const loadActionItems = useCallback(async () => {
    try {
      const data = await getAllActionItems();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

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
     
      onActionItems={() => setIsActionPopupOpen(true)
}
      onParticipants={openPopup}
    
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
