import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { meetingId } = useParams();
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
  } = useMeetings();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('date-desc');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [draftFilterDate, setDraftFilterDate] = useState('');
  const [isActionPopupOpen, setIsActionPopupOpen] = useState(false);
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
    onDeleted: () => navigate('/meeting-list'),
  });

  const { popupProps: participantsPopupProps, openPopup } = useMeetingParticipants(selectedMeetingId);
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
      setTranscript(null);
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
    if (isActionPopupOpen && selectedMeetingId) {
      void loadActionItems();
    }
  }, [isActionPopupOpen, loadActionItems, selectedMeetingId]);

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
    navigate(`/meeting/${id}`);
  };

  const handleRegisterDeleteOpen = useCallback((open: () => void) => {
    deleteDialogOpenRef.current = open;
  }, []);

  const handleOpenDelete = () => {
    deleteDialogOpenRef.current();
  };

  const transcriptResponse = meeting?.transcriptResponse ?? transcript;
  const showSplitView = hasRouteMeetingId;

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
        onActionItems={() => setIsActionPopupOpen(true)}
        onParticipants={openPopup}
        rightSlot={
          transcriptResponse ? (
            <TranscriptSection
              meetingId={selectedMeetingId}
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
          registerOpen={handleRegisterDeleteOpen}
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
          onSave={(payload) => handleSaveActionItem(payload, selectedMeetingId)}
        />
      </MeetingDetailsTemplate>
    );
  })();

  return (
    <MeetingLayoutTemplate
      activePage="meeting-list"
      contentClassName="max-w-none"
      onNavigateMeetingList={() => navigate('/meeting-list')}
      onNavigateToDoList={() => navigate('/to-do-list')}
      addMeetingSlot={
        <AddMeetingModal
          onCreateMeeting={handleCreateMeeting}
          isCreatingMeeting={isCreatingMeeting}
          createMeetingError={createMeetingError}
        />
      }
      toolbarSlot={
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
      }
    >
      <div
        className={`grid min-h-0 flex-1 gap-4 ${
          showSplitView ? 'lg:grid-cols-[minmax(0,1.65fr)_minmax(360px,1fr)]' : ''
        }`}
      >
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

        {rightPanel ? (
          <div className="flex min-h-0 flex-1 flex-col">
            {rightPanel}
          </div>
        ) : null}
      </div>
    </MeetingLayoutTemplate>
  );
};

export default MeetingListPage;
