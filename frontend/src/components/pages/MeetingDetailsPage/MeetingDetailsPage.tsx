import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StateMessage from '@atoms/StateMessage/StateMessage';
import AttendeesListPopup from '@organisms/Atendees/AttendeesListPopup/AttendeesListPopup';
import { MeetingConfirmationDialog } from '@molecules/ConfirmationDialog/ConfirmationDialog';
import MeetingDetailsTemplate from '@templates/MeetingDetailsTemplate/MeetingDetailsTemplate';
import ActionItemPopup from '@organisms/ActionItems/ActionItemPopup/ActionItemPopup';
import TranscriptSection from '@organisms/Transcript/TranscriptSection/TranscriptSection';

import { getTranscriptByMeetingId, TranscriptResponse } from '@/api/transcriptApi';
import useMeetingDetails from '@/hooks/useMeetingDetails';
import useMeetingParticipants from '@/hooks/useMeetingParticipants';
import { useActionItems } from '@/hooks/useActionItems';

const MeetingDetailsPage: FC = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const resolvedId = Number(meetingId);
  const isInvalidId = Number.isNaN(resolvedId);

  const deleteDialogOpenRef = useRef<() => void>(() => undefined);

  const [isActionPopupOpen, setIsActionPopupOpen] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);

  const {
    items: actionItems,
    isLoading: isActionItemsLoading,
    error: actionItemsError,
    deletingId: actionItemDeletingId,
    savingId: actionItemSavingId,
    handleSaveActionItem,
    handleDeleteActionItem,
    loadActionItems,
  } = useActionItems(isInvalidId ? null : resolvedId);

  useEffect(() => {
    if (isActionPopupOpen) {
      void loadActionItems();
    }
  }, [isActionPopupOpen, loadActionItems]);

  useEffect(() => {
    if (isInvalidId) return;

    const controller = new AbortController();
    const loadTranscript = async () => {
      try {
        const data = await getTranscriptByMeetingId(resolvedId, controller.signal);
        setTranscript(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setTranscript(null);
      }
    };

    loadTranscript();
    return () => controller.abort();
  }, [isInvalidId, resolvedId]);

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
  const transcriptResponse = meeting?.transcriptResponse ?? transcript;

  const registerDeleteOpen = useCallback((open: () => void) => {
    deleteDialogOpenRef.current = open;
  }, []);

  const handleOpenDelete = () => {
    if (meeting) deleteDialogOpenRef.current();
  };

  if (isLoading) return <StateMessage variant="loading" message="Loading meeting..." />;
  if (isInvalidId) return <StateMessage variant="error" message="Invalid meeting id." />;
  if (error) return <StateMessage variant="error" message={error} />;

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
      onActionItems={() => setIsActionPopupOpen(true)}
      onParticipants={openPopup}
      rightSlot={
        transcriptResponse ? (
          <TranscriptSection
            meetingId={resolvedId}
            fileName={transcriptResponse.fileName}
            filePath={transcriptResponse.filePath}
          />
        ) : null
      }
    >
      <AttendeesListPopup {...participantsPopupProps} />
      <MeetingConfirmationDialog
        isSaving={isSaving}
        error={deleteError}
        onConfirm={onDelete}
        registerOpen={registerDeleteOpen}
      />
      <ActionItemPopup
        items={actionItems}
        isOpen={isActionPopupOpen}
        isLoading={isActionItemsLoading}
        error={actionItemsError}
        deletingId={actionItemDeletingId}
        savingId={actionItemSavingId}
        onClose={() => setIsActionPopupOpen(false)}
        onDelete={handleDeleteActionItem}
        onSave={(payload) => handleSaveActionItem(payload, resolvedId)}
      />
    </MeetingDetailsTemplate>
  );
};

export default MeetingDetailsPage;
