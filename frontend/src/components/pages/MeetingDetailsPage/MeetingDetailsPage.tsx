import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import StateMessage from '@atoms/StateMessage/StateMessage';
import AttendeesListPopup from '@organisms/Atendees/AttendeesListPopup/AttendeesListPopup';
import { MeetingConfirmationDialog } from '@molecules/ConfirmationDialog/ConfirmationDialog';
import MeetingDetailsTemplate from '@templates/MeetingDetailsTemplate/MeetingDetailsTemplate';
import ActionItemPopup from '@organisms/ActionItems/ActionItemPopup/ActionItemPopup';
import TranscriptSection from '@organisms/Transcript/TranscriptSection/TranscriptSection';
import MeetingDetailsHeader from '@molecules/MeetingDetailsHeader/MeetingDetailsHeader';
import MeetingSummaryActions from '@molecules/MeetingSummaryActions/MeetingSummaryActions';
import { triggerAiProcessing } from '@/api/aiApi';  

import { getTranscriptByMeetingId, TranscriptResponse } from '@/api/transcriptApi';
import useMeetingDetails from '@/hooks/useMeetingDetails';
import useMeetingParticipants from '@/hooks/useMeetingParticipants';
import { useActionItems } from '@/hooks/useActionItems';
import { MeetingStatus, normalizeStatus } from '@/hooks/useMeetings';

const MeetingDetailsPage: FC = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const resolvedId = Number(meetingId);
  const isInvalidId = Number.isNaN(resolvedId);

  const deleteDialogOpenRef = useRef<() => void>(() => undefined);

  const [isActionPopupOpen, setIsActionPopupOpen] = useState(false);
  const [contentView, setContentView] = useState<'transcript' | 'summary'>('summary');
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [isSummaryReprocessing, setIsSummaryReprocessing] = useState(false);
  const [isParticipantsReprocessing, setIsParticipantsReprocessing] = useState(false);
  const [isActionItemsReprocessing, setIsActionItemsReprocessing] = useState(false);

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

  const { popupProps: participantsPopupProps, openPopup, refreshParticipants } = useMeetingParticipants(
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
    refresh: refreshMeetingDetails,
    setStatusOptimistically,
  } = useMeetingDetails(isInvalidId ? null : resolvedId, {
    onDeleted: () => navigate('/meeting-list'),
  });

  const canEdit = Boolean(meeting) && !isLoading && !isInvalidId && !error;
  const displayTitle = isLoading ? 'Loading...' : meetingTitle;
  const displayDateLabel = canEdit ? meetingDateLabel : '';
  const displayIsEditing = canEdit ? isEditingTitle : false;
  const transcriptResponse = meeting?.transcript ?? transcript;
  const isProcessing = normalizeStatus(meeting?.aiStatus) === 'PROCESSING';
  const isSummaryActionDisabled =
    isProcessing || isSummaryReprocessing || isParticipantsReprocessing || isActionItemsReprocessing;

  const handleGenerateSummary = async () => {
    console.log('Generate summary clicked');
    if (isInvalidId) return;
    try {
      setIsSummaryReprocessing(true);
      setStatusOptimistically('PROCESSING');
      console.log('Triggering AI processing for meeting ID:', resolvedId);
      await triggerAiProcessing(resolvedId);
      await refreshMeetingDetails(true);
    } catch (err) {
      setStatusOptimistically('FAILED');
      console.error('Failed to trigger AI processing:', err);
    } finally {
      setIsSummaryReprocessing(false);
    }
  };

  const handleReprocessParticipants = async () => {
    if (isInvalidId) return;
    try {
      setIsParticipantsReprocessing(true);
      await triggerAiProcessing(resolvedId, 'participants');
      await refreshParticipants();
    } catch (err) {
      console.error('Failed to reprocess participants:', err);
    } finally {
      setIsParticipantsReprocessing(false);
    }
  };

  const handleReprocessActionItems = async () => {
    if (isInvalidId) return;
    try {
      setIsActionItemsReprocessing(true);
      await triggerAiProcessing(resolvedId, 'action_items');
      await loadActionItems();
    } catch (err) {
      console.error('Failed to reprocess action items:', err);
    } finally {
      setIsActionItemsReprocessing(false);
    }
  };

  const handleReprocessSummary = async () => {
    if (isInvalidId) return;
    try {
      setIsSummaryReprocessing(true);
      setStatusOptimistically('PROCESSING');
      await triggerAiProcessing(resolvedId, 'summary');
      await refreshMeetingDetails(true);
    } catch (err) {
      setStatusOptimistically('FAILED');
      console.error('Failed to reprocess summary:', err);
    } finally {
      setIsSummaryReprocessing(false);
    }
  };

  const registerDeleteOpen = useCallback((open: () => void) => {
    deleteDialogOpenRef.current = open;
  }, []);

  const handleOpenDelete = () => {
    if (meeting) deleteDialogOpenRef.current();
  };

  const summaryText = meeting?.description?.trim() || 'No summary available.';

  if (isLoading) return <StateMessage variant="loading" message="Loading meeting..." />;
  if (isInvalidId) return <StateMessage variant="error" message="Invalid meeting id." />;
  if (error) return <StateMessage variant="error" message={error} />;

  return (
    <MeetingDetailsTemplate
      headerSlot={
        <MeetingDetailsHeader
          meetingTitle={displayTitle}
          meetingDateLabel={displayDateLabel}
          status={(meeting?.aiStatus as MeetingStatus) || 'IDLE'}
          isEditingTitle={displayIsEditing}
          editTitleValue={canEdit ? draftTitle : ''}
          editDateValue={canEdit ? draftDate : ''}
          layout="page"
          onEditTitleValueChange={canEdit ? setDraftTitle : () => undefined}
          onEditDateValueChange={canEdit ? setDraftDate : () => undefined}
          onToggleEditTitle={canEdit ? toggleEditTitle : () => undefined}
          onSave={canEdit ? onSave : () => undefined}
          onDelete={canEdit ? handleOpenDelete : () => undefined}
          onClose={() => navigate('/meeting-list')}
          onGenerateSummary={handleGenerateSummary}
        />
      }
      summarySlot={
        <MeetingSummaryActions
          activeView="overview"
          onOverview={() => undefined}
          onActionItems={() => setIsActionPopupOpen(true)}
          onParticipants={openPopup}
        />
      }
      rightSlot={
        transcriptResponse ? (
          <div className="flex h-full flex-col gap-6">
            <div className="flex items-center gap-2">
              <Button
                label="Transcript"
                variant={contentView === 'transcript' ? 'nav-active' : 'link'}
                onClick={() => setContentView('transcript')}
                icon={<Icon name="file" className="h-3.5 w-3.5" />}
              />
              <Button
                label="Summary"
                variant={contentView === 'summary' ? 'nav-active' : 'link'}
                onClick={() => setContentView('summary')}
                icon={<Icon name="bolt" className="h-3.5 w-3.5" />}
              />
            </div>

            <div className="flex-1 overflow-hidden">
              {contentView === 'summary' ? (
                <div className="flex h-full flex-col gap-4 rounded-2xl border-2 border-[#24452a] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#24452a]/10 pb-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-[#24452a]/70">
                      Meeting Summary
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="reprocess"
                        onClick={handleReprocessSummary}
                        aria-label="Reprocess meeting"
                        icon={<Icon name="refresh" className="h-4 w-4" />}
                        disabled={isSummaryActionDisabled}
                        className={`h-8 w-8 ${isSummaryActionDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                      />
                      <Icon name="bolt" className="h-5 w-5 text-[#24452a]/40" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <p className="whitespace-pre-line text-base leading-relaxed text-[#1f2937]">
                      {summaryText}
                    </p>
                  </div>
                </div>
              ) : (
                <TranscriptSection
                  meetingId={resolvedId}
                  fileName={transcriptResponse.fileName}
                  filePath={transcriptResponse.filePath}
                />
              )}
            </div>
          </div>
        ) : null
      }
    >
      <AttendeesListPopup
        {...participantsPopupProps}
        onReprocess={handleReprocessParticipants}
        isReprocessing={isParticipantsReprocessing}
      />
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
        onReprocess={handleReprocessActionItems}
        isReprocessing={isActionItemsReprocessing}
        onClose={() => setIsActionPopupOpen(false)}
        onDelete={handleDeleteActionItem}
        onSave={async (payload) => {
          await handleSaveActionItem(payload, resolvedId);
        }}
      />
    </MeetingDetailsTemplate>
  );
};

export default MeetingDetailsPage;
