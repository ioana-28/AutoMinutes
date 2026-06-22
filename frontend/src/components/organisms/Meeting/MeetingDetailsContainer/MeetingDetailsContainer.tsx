import { FC, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import StateMessage from '@atoms/StateMessage/StateMessage';
import StatusDot from '@atoms/StatusDot/StatusDot';
import MeetingDetailsTemplate from '@templates/MeetingDetailsTemplate/MeetingDetailsTemplate';
import MeetingDetailsHeader from '@molecules/MeetingDetailsHeader/MeetingDetailsHeader';
import MeetingSummaryActions from '@molecules/MeetingSummaryActions/MeetingSummaryActions';
import AttendeesListPopup from '@organisms/Atendees/AttendeesListPopup/AttendeesListPopup';
import ActionItemPopup from '@organisms/ActionItems/ActionItemPopup/ActionItemPopup';
import { MeetingConfirmationDialog } from '@molecules/ConfirmationDialog/ConfirmationDialog';
import TranscriptSection from '@organisms/Transcript/TranscriptSection/TranscriptSection';
import { MeetingStatus, normalizeStatus } from '@/hooks/useMeetings';
import useMeetingDetails from '@/hooks/useMeetingDetails';
import useMeetingParticipants from '@/hooks/useMeetingParticipants';
import { useActionItems } from '@/hooks/useActionItems';
import { getTranscriptByMeetingId, TranscriptResponse } from '@/api/transcriptApi';
import { triggerAiProcessing } from '@/api/aiApi';


import { 
  MeetingDetailsContainerProps, 
  DetailsViewMode, 
  ContentViewMode, 
  ActionItemPayload 
} from './IMeetingDetailsContainer';

export const MeetingDetailsContainer: FC<MeetingDetailsContainerProps> = ({
  selectedMeetingId,
  isInvalidRouteMeetingId,
  refreshMeetings,
}) => {
  const navigate = useNavigate();

  
  const [detailsView, setDetailsView] = useState<DetailsViewMode>('overview');
  const [contentView, setContentView] = useState<ContentViewMode>('summary');
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [isSummaryReprocessing, setIsSummaryReprocessing] = useState(false);
  const [isParticipantsReprocessing, setIsParticipantsReprocessing] = useState(false);
  const [isActionItemsReprocessing, setIsActionItemsReprocessing] = useState(false);


  const deleteDialogOpenRef = useRef<() => void>(() => undefined);

  const {
    meeting,
    meetingTitle,
    meetingDateLabel,
    draftTitle,
    draftDate,
    isEditingTitle,
    isLoading: isMeetingDetailsLoading,
    isSaving,
    error: meetingDetailsError,
    deleteError,
    setDraftTitle,
    setDraftDate,
    toggleEditTitle,
    onSave,
    onDelete,
    refresh: refreshMeetingDetails,
    setStatusOptimistically,
  } = useMeetingDetails(selectedMeetingId, {
    onDeleted: () => {
      void Promise.resolve().then(() => refreshMeetings());
      navigate('/meeting-list');
    },
    onUpdated: () => {
      void Promise.resolve().then(() => refreshMeetings());
    },
  });

  const {
    popupProps: participantsPopupProps,
    openPopup,
    closePopup,
    refreshParticipants,
  } = useMeetingParticipants(selectedMeetingId, {
    onParticipantsChanged: refreshMeetings,
  });

  const {
    items: actionItems,
    isLoading: isActionItemsLoading,
    error: actionItemsError,
    deletingId: actionItemDeletingId,
    savingId: actionItemSavingId,
    handleSaveActionItem,
    handleDeleteActionItem,
    loadActionItems,
  } = useActionItems(selectedMeetingId);

  useEffect(() => {
    if (!selectedMeetingId) {
      return;
    }

    const controller = new AbortController();

    const loadTranscript = async () => {
      try {
        const data = await getTranscriptByMeetingId(selectedMeetingId, controller.signal);
        setTranscript(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setTranscript(null);
      }
    };

    void loadTranscript();

    return () => {
      controller.abort();
      setTranscript(null);
    };
  }, [selectedMeetingId]);

  useEffect(() => {
    if (detailsView === 'action-items' && selectedMeetingId) {
      void loadActionItems();
    }
  }, [detailsView, loadActionItems, selectedMeetingId]);

  useEffect(() => {
    if (detailsView === 'participants' && selectedMeetingId) {
      openPopup();
      return;
    }
    closePopup();
  }, [closePopup, detailsView, openPopup, selectedMeetingId]);

  const handleToggleDetailsView = (view: Exclude<DetailsViewMode, 'overview'>) => {
    setDetailsView((currentView) => (currentView === view ? 'overview' : view));
  };

  const handleRegisterDeleteOpen = useCallback((open: () => void) => {
    deleteDialogOpenRef.current = open;
  }, []);

  const handleOpenDelete = () => {
    deleteDialogOpenRef.current();
  };

  const handleGenerateSummary = async () => {
    if (!selectedMeetingId) return;

     try {
      setIsSummaryReprocessing(true);
      setStatusOptimistically('PROCESSING');
      await triggerAiProcessing(selectedMeetingId);
      void refreshMeetings(true);
      await refreshMeetingDetails(true);
    } catch (err) {
      setStatusOptimistically('FAILED');
      console.error('Failed to trigger AI processing:', err);
    } finally {
      setIsSummaryReprocessing(false);
    }
  };


  
  const handleActionItemSave = async (payload: ActionItemPayload) => {
    const isCreate = payload.id === 0;
    await handleSaveActionItem(payload, selectedMeetingId ?? undefined);
    if (isCreate) {
      void refreshMeetings(true);
    }
  };

  const handleActionItemDelete = async (id: number) => {
    await handleDeleteActionItem(id);
    void refreshMeetings(true);
  };

const handleReprocessParticipants = async () => {
    if (!selectedMeetingId) {
      return;
    }

    try {
      setStatusOptimistically('PROCESSING');
      setIsParticipantsReprocessing(true);
      await triggerAiProcessing(selectedMeetingId, 'participants');
      void refreshMeetings(true);
      await refreshParticipants();
      await refreshMeetingDetails(true);
    } catch (err) {
      setStatusOptimistically('FAILED');
      console.error('Failed to reprocess participants:', err);
    } finally {
      setIsParticipantsReprocessing(false);
    }
  };

  const handleReprocessActionItems = async () => {
    if (!selectedMeetingId) {
      return;
    }

    try {
      setStatusOptimistically('PROCESSING');
      setIsActionItemsReprocessing(true);
      await triggerAiProcessing(selectedMeetingId, 'action_items');
      void refreshMeetings(true);
      await loadActionItems();
      await refreshMeetingDetails(true);
    } catch (err) {
      setStatusOptimistically('FAILED');
      console.error('Failed to reprocess action items:', err);
    } finally {
      setIsActionItemsReprocessing(false);
    }
  };

  const handleReprocessSummary = async () => {
    if (!selectedMeetingId) {
      return;
    }

    try {
      setIsSummaryReprocessing(true);
      setStatusOptimistically('PROCESSING');
      await triggerAiProcessing(selectedMeetingId, 'summary');
      void refreshMeetings(true);
      await refreshMeetingDetails(true);
    } catch (err) {
      setStatusOptimistically('FAILED');
      console.error('Failed to reprocess summary:', err);
    } finally {
      setIsSummaryReprocessing(false);
    }
  };


  const transcriptResponse = meeting?.transcript ?? transcript;
  const summaryText = meeting?.description?.trim() || 'No summary available.';
  const isProcessing = normalizeStatus(meeting?.aiStatus) === 'PROCESSING';
  const isSummaryActionDisabled =
    isProcessing || isSummaryReprocessing || isParticipantsReprocessing || isActionItemsReprocessing;
  const meetingStatus = (meeting?.aiStatus as MeetingStatus) || 'IDLE';

  if (isInvalidRouteMeetingId) {
    return <StateMessage variant="error" message="Invalid meeting id." />;
  }

  if (!selectedMeetingId || isMeetingDetailsLoading) {
    return <StateMessage variant="loading" message="Loading meeting..." />;
  }

  if (meetingDetailsError) {
    return <StateMessage variant="error" message={meetingDetailsError} />;
  }

  return (
    <MeetingDetailsTemplate
      layout="panel"
      headerSlot={
        <MeetingDetailsHeader
          meetingTitle={meetingTitle}
          meetingDateLabel={meetingDateLabel}
          status={meetingStatus}
          isEditingTitle={isEditingTitle}
          editTitleValue={draftTitle}
          editDateValue={draftDate}
          layout="panel"
          onEditTitleValueChange={setDraftTitle}
          onEditDateValueChange={setDraftDate}
          onToggleEditTitle={toggleEditTitle}
          onSave={onSave}
          onDelete={handleOpenDelete}
          onClose={() => navigate('/meeting-list')}
          onGenerateSummary={handleGenerateSummary}
        />
      }
      summarySlot={
        <MeetingSummaryActions
          activeView={detailsView}
          onOverview={() => setDetailsView('overview')}
          onActionItems={() => handleToggleDetailsView('action-items')}
          onParticipants={() => handleToggleDetailsView('participants')}
        />
      }
      panelTopSlot={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              label={isProcessing ? 'Processing...' : 'Generate Summary'}
              variant="generate-summary"
              onClick={handleGenerateSummary}
              aria-label="Generate summary"
              icon={<Icon name="bolt" className="h-3.5 w-3.5" />}
               disabled={isSummaryActionDisabled}
                className={isSummaryActionDisabled ? 'opacity-60 cursor-not-allowed' : ''}
            />
          </div>

          <div className="flex items-center gap-2 px-2">
            <StatusDot status={meetingStatus} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3d5f46]/60">
              {meetingStatus}
            </span>
          </div>
        </div>
      }
      rightSlot={
        detailsView === 'participants' ? (
          <AttendeesListPopup
            variant="panel"
            {...participantsPopupProps}
            onClose={() => setDetailsView('overview')}
            onReprocess={handleReprocessParticipants}
            isReprocessing={isParticipantsReprocessing}
          />
        ) : detailsView === 'action-items' ? (
          <ActionItemPopup
            variant="panel"
            isOpen={true}
            onClose={() => setDetailsView('overview')}
            items={actionItems}
            isLoading={isActionItemsLoading}
            error={actionItemsError}
            deletingId={actionItemDeletingId}
            savingId={actionItemSavingId}
             onReprocess={handleReprocessActionItems}
              isReprocessing={isActionItemsReprocessing}
            onDelete={handleActionItemDelete}
            onSave={handleActionItemSave}
          />
        ) : transcriptResponse ? (
          <div className="flex h-full min-h-0 flex-col gap-3">
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

            <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-[#7f9d86]/20 bg-[#f8f4ec] p-4 shadow-sm">
              {contentView === 'summary' ? (
                <div className="flex h-full flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3d5f46]/70">
                      Summary
                    </span>
                    <Button
                     variant="reprocess"
                        onClick={handleReprocessSummary}
                        aria-label="Reprocess meeting"
                        className={`h-7 w-7 ${isSummaryActionDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                        icon={<Icon name="refresh" className="h-3.5 w-3.5" />}
                        disabled={isSummaryActionDisabled}
                    />
                  </div>
                  <p className="whitespace-pre-line text-sm leading-6 text-[#1f2937]">
                    {summaryText}
                  </p>
                </div>
              ) : (
                <TranscriptSection
                  meetingId={selectedMeetingId}
                  fileName={transcriptResponse.fileName}
                  filePath={transcriptResponse.filePath}
                />
              )}
            </div>
          </div>
        ) : null
      }
    >
      <MeetingConfirmationDialog
        isSaving={isSaving}
        error={deleteError}
        onConfirm={onDelete}
        registerOpen={handleRegisterDeleteOpen}
      />
    </MeetingDetailsTemplate>
  );
};