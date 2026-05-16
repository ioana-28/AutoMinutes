import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import StateMessage from '@atoms/StateMessage/StateMessage';
import AddMeetingModal from '@organisms/Meeting/AddMeetingModal/AddMeetingModal';
import MeetingList, { MeetingListToolbar } from '@organisms/Meeting/MeetingList/MeetingList';
import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import MeetingDetailsTemplate from '@templates/MeetingDetailsTemplate/MeetingDetailsTemplate';
import AttendeesListPopup from '@organisms/Atendees/AttendeesListPopup/AttendeesListPopup';
import ActionItemPopup from '@organisms/ActionItems/ActionItemPopup/ActionItemPopup';
import { MeetingConfirmationDialog } from '@molecules/ConfirmationDialog/ConfirmationDialog';
import TranscriptSection from '@organisms/Transcript/TranscriptSection/TranscriptSection';
import { useMeetings, MeetingStatus } from '@/hooks/useMeetings';
import useMeetingDetails from '@/hooks/useMeetingDetails';
import useMeetingParticipants from '@/hooks/useMeetingParticipants';
import { getTranscriptByMeetingId, TranscriptResponse } from '@/api/transcriptApi';
import { useActionItems } from '@/hooks/useActionItems';

const MeetingListPage: FC = () => {
  const navigate = useNavigate();
  const storedUserId = Number(localStorage.getItem('userId'));
  const activeUserId = Number.isFinite(storedUserId) && storedUserId > 0 ? storedUserId : null;
  const { meetingId } = useParams();
  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('auth:changed'));
    navigate('/auth', { replace: true });
  };
  const parsedMeetingId = meetingId ? Number(meetingId) : null;
  const hasRouteMeetingId = typeof meetingId === 'string';
  const selectedMeetingId =
    parsedMeetingId !== null && !Number.isNaN(parsedMeetingId) ? parsedMeetingId : null;
  const isInvalidRouteMeetingId = hasRouteMeetingId && selectedMeetingId === null;

  const {
    items,
    isLoading,
    error,
    isCreatingMeeting,
    createMeetingError,
    handleCreateMeeting,
    refreshMeetings,
  } = useMeetings(activeUserId);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('date-desc');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [draftFilterDate, setDraftFilterDate] = useState('');
  const [detailsView, setDetailsView] = useState<'overview' | 'participants' | 'action-items'>(
    'overview',
  );
  const [contentView, setContentView] = useState<'transcript' | 'summary'>('summary');
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);

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
  } = useMeetingDetails(selectedMeetingId, {
    onDeleted: () => {
      refreshMeetings();
      navigate('/meeting-list');
    },
    onUpdated: () => {
      refreshMeetings();
    },
  });

  const {
    popupProps: participantsPopupProps,
    openPopup,
    closePopup,
  } = useMeetingParticipants(selectedMeetingId);
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
      void Promise.resolve().then(() => setTranscript(null));
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

    loadTranscript();

    return () => controller.abort();
  }, [selectedMeetingId]);

  useEffect(() => {
    if (detailsView === 'action-items' && selectedMeetingId) {
      void Promise.resolve().then(() => {
        void loadActionItems();
      });
    }
  }, [detailsView, loadActionItems, selectedMeetingId]);

  useEffect(() => {
    if (detailsView === 'participants' && selectedMeetingId) {
      openPopup();
      return;
    }

    closePopup();
  }, [closePopup, detailsView, openPopup, selectedMeetingId]);

  useEffect(() => {
    void Promise.resolve().then(() => {
      setDetailsView('overview');
      setContentView('summary');
    });
  }, [selectedMeetingId]);

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const filtered = query
      ? items.filter((item) =>
          [item.title, item.description, item.dateLabel].some((value) =>
            value.toLowerCase().includes(query),
          ),
        )
      : items;

    const filteredByDate = filterDate.trim();
    const filteredWithFilters = filtered.filter((item) => {
      const matchesDate = filteredByDate
        ? (() => {
            if (!item.dateValue) return false;
            const itemDate = new Date(item.dateValue);
            const filterDateValue = new Date(`${filteredByDate}T00:00:00`);
            return (
              itemDate.getFullYear() === filterDateValue.getFullYear() &&
              itemDate.getMonth() === filterDateValue.getMonth() &&
              itemDate.getDate() === filterDateValue.getDate()
            );
          })()
        : true;

      return matchesDate;
    });

    return [...filteredWithFilters].sort((a, b) => {
      switch (sortKey) {
        case 'date-asc':
          return (a.dateValue ?? 0) - (b.dateValue ?? 0);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'status': {
          const order: Record<MeetingStatus, number> = {
            COMPLETED: 1,
            PROCESSING: 2,
            IDLE: 3,
            FAILED: 4,
            UNKNOWN: 5,
          };
          return order[a.status] - order[b.status];
        }
        case 'date-desc':
        default:
          return (b.dateValue ?? 0) - (a.dateValue ?? 0);
      }
    });
  }, [items, searchTerm, sortKey, filterDate]);

  const handleToggleExpand = (id: string | number) => {
    setExpandedId((prev) => (prev === id ? null : Number(id)));
  };

  const handleApplyFilter = () => {
    setFilterDate(draftFilterDate.trim());
    setIsFilterOpen(false);
  };

  const handleClearFilter = () => {
    setDraftFilterDate('');
    setFilterDate('');
    setIsFilterOpen(false);
  };

  const handleInfoClick = (id: number) => {
    if (selectedMeetingId === id) {
      navigate('/meeting-list');
    } else {
      navigate(`/meeting/${id}`);
    }
  };

  const handleToggleDetailsView = (view: 'participants' | 'action-items') => {
    setDetailsView((currentView) => (currentView === view ? 'overview' : view));
  };

  const handleRegisterDeleteOpen = useCallback((open: () => void) => {
    deleteDialogOpenRef.current = open;
  }, []);

  const handleOpenDelete = () => {
    deleteDialogOpenRef.current();
  };

  const transcriptResponse = meeting?.transcriptResponse ?? transcript;
  const showSplitView = hasRouteMeetingId;
  const summaryText = meeting?.description?.trim() || 'No summary available.';

  const rightPanel = (() => {
    if (!showSplitView) {
      return null;
    }

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
        meetingTitle={meetingTitle}
        meetingDateLabel={meetingDateLabel}
        status={(meeting?.aiStatus as MeetingStatus) || 'IDLE'}
        isEditingTitle={isEditingTitle}
        editTitleValue={draftTitle}
        editDateValue={draftDate}
        isSaving={isSaving}
        onEditTitleValueChange={setDraftTitle}
        onEditDateValueChange={setDraftDate}
        onToggleEditTitle={toggleEditTitle}
        onSave={onSave}
        onDelete={handleOpenDelete}
        onClose={() => navigate('/meeting-list')}
        activeView={detailsView}
        onOverview={() => setDetailsView('overview')}
        onActionItems={() => handleToggleDetailsView('action-items')}
        onParticipants={() => handleToggleDetailsView('participants')}
        rightSlot={
          detailsView === 'participants' ? (
            <AttendeesListPopup
              variant="panel"
              {...participantsPopupProps}
              onClose={() => setDetailsView('overview')}
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
              onDelete={handleDeleteActionItem}
              onSave={(payload) => handleSaveActionItem(payload, selectedMeetingId)}
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
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3d5f46]/70">
                      Summary
                    </span>
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
  })();

  const toolbar = (
    <MeetingListToolbar
      searchTerm={searchTerm}
      sortKey={sortKey}
      isFilterOpen={isFilterOpen}
      draftFilterDate={draftFilterDate}
      onSearchTermChange={setSearchTerm}
      onSortKeyChange={setSortKey}
      onOpenFilter={() => {
        setDraftFilterDate(filterDate);
        setIsFilterOpen(true);
      }}
      onCloseFilter={() => setIsFilterOpen(false)}
      onApplyFilter={handleApplyFilter}
      onClearFilter={handleClearFilter}
      onDraftFilterDateChange={setDraftFilterDate}
    />
  );

  return (
    <MeetingLayoutTemplate
      activePage="meeting-list"
      contentClassName={showSplitView ? 'p-0' : 'p-4 max-w-none'}
      onNavigateMeetingList={() => navigate('/meeting-list')}
      onNavigateToDoList={() => navigate('/to-do-list')}
      onLogout={handleLogout}
      addMeetingSlot={
        <AddMeetingModal
          onCreateMeeting={handleCreateMeeting}
          isCreatingMeeting={isCreatingMeeting}
          createMeetingError={createMeetingError}
        />
      }
      toolbarSlot={showSplitView ? null : toolbar}
    >
      <div
        className={`grid min-h-0 flex-1 ${
          showSplitView ? 'gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)]' : 'gap-4'
        }`}
      >
        <div className={`flex min-h-0 flex-col ${showSplitView ? 'gap-4 p-4' : 'gap-4'}`}>
          {showSplitView ? toolbar : null}
          <div className="min-h-0 overflow-y-auto">
            <MeetingList
              isLoading={isLoading}
              error={error}
              items={filteredItems}
              expandedId={expandedId}
              selectedId={selectedMeetingId}
              onToggleExpand={handleToggleExpand}
              onInfoClick={handleInfoClick}
            />
          </div>
        </div>

        {rightPanel ? <div className="flex min-h-0 flex-1 flex-col">{rightPanel}</div> : null}
      </div>
    </MeetingLayoutTemplate>
  );
};

export default MeetingListPage;