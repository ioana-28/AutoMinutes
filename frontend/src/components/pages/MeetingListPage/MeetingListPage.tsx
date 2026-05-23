import { FC, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddMeetingModal from '@organisms/Meeting/AddMeetingModal/AddMeetingModal';
import MeetingList, { MeetingListToolbar } from '@organisms/Meeting/MeetingList/MeetingList';
import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import MeetingNavbar from '@organisms/Meeting/MeetingNavbar/MeetingNavbar';
import { useMeetings, MeetingStatus } from '@/hooks/useMeetings';
import { MeetingDetailsContainer } from '@organisms/Meeting/MeetingDetailsContainer/MeetingDetailsContainer';

const MeetingListPage: FC = () => {
  const navigate = useNavigate();
  const storedUserId = Number(localStorage.getItem('userId'));
  const activeUserId = Number.isFinite(storedUserId) && storedUserId > 0 ? storedUserId : null;
  const { meetingId } = useParams();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
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
    clearCreateMeetingError,
  } = useMeetings(activeUserId);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('date-desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hasActionItemsFilter, setHasActionItemsFilter] = useState(false);
  const [draftStartDate, setDraftStartDate] = useState('');
  const [draftEndDate, setDraftEndDate] = useState('');
  const [draftStatusFilter, setDraftStatusFilter] = useState('All');
  const [draftHasActionItems, setDraftHasActionItems] = useState(false);

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const filtered = query
      ? items.filter((item) => {
          const matchesBasicFields = [
            item.title,
            item.description,
            item.dateLabel,
          ].some((value) => value.toLowerCase().includes(query));

          const matchesTranscript =
            item.transcriptContent?.toLowerCase().includes(query) || false;

          return matchesBasicFields || matchesTranscript;
        })
      : items;

    const filteredWithFilters = filtered.filter((item) => {
      const matchesStatus = statusFilter !== 'All' ? item.status === statusFilter : true;
      const matchesActionItems = hasActionItemsFilter ? item.actionItemsCount > 0 : true;

      if (!item.dateValue) {
        const dateFiltersActive = !!startDate || !!endDate;
        if (dateFiltersActive) return false;
        return matchesStatus && matchesActionItems;
      }

      const itemDate = new Date(item.dateValue);
      itemDate.setHours(0, 0, 0, 0);

      const matchesStart = startDate ? itemDate >= new Date(`${startDate}T00:00:00`) : true;
      const matchesEnd = endDate ? itemDate <= new Date(`${endDate}T00:00:00`) : true;

      return matchesStart && matchesEnd && matchesStatus && matchesActionItems;
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
  }, [items, searchTerm, sortKey, startDate, endDate, statusFilter, hasActionItemsFilter]);

  const handleApplyFilter = () => {
    setStartDate(draftStartDate.trim());
    setEndDate(draftEndDate.trim());
    setStatusFilter(draftStatusFilter);
    setHasActionItemsFilter(draftHasActionItems);
    setIsFilterOpen(false);
  };

  const handleClearFilter = () => {
    setDraftStartDate('');
    setDraftEndDate('');
    setDraftStatusFilter('All');
    setDraftHasActionItems(false);
    setStartDate('');
    setEndDate('');
    setStatusFilter('All');
    setHasActionItemsFilter(false);
    setIsFilterOpen(false);
  };

  const handleInfoClick = (id: number) => {
    if (selectedMeetingId === id) {
      navigate('/meeting-list');
    } else {
      navigate(`/meeting/${id}`);
    }
  };

  const showSplitView = hasRouteMeetingId;

  const toolbar = (
    <MeetingListToolbar
      searchTerm={searchTerm}
      sortKey={sortKey}
      isFilterOpen={isFilterOpen}
      draftStartDate={draftStartDate}
      draftEndDate={draftEndDate}
      draftStatusFilter={draftStatusFilter}
      draftHasActionItems={draftHasActionItems}
      onSearchTermChange={setSearchTerm}
      onSortKeyChange={setSortKey}
      onOpenFilter={() => {
        if (!isFilterOpen) {
          setDraftStartDate(startDate);
          setDraftEndDate(endDate);
          setDraftStatusFilter(statusFilter);
          setDraftHasActionItems(hasActionItemsFilter);
        }
        setIsFilterOpen(!isFilterOpen);
      }}
      onCloseFilter={() => setIsFilterOpen(false)}
      onApplyFilter={handleApplyFilter}
      onClearFilter={handleClearFilter}
      onDraftStartDateChange={setDraftStartDate}
      onDraftEndDateChange={setDraftEndDate}
      onDraftStatusFilterChange={setDraftStatusFilter}
      onDraftHasActionItemsChange={setDraftHasActionItems}
    />
  );

  return (
    <MeetingLayoutTemplate
      contentClassName={showSplitView ? 'px-4 py-3 lg:p-0' : 'px-4 py-3 sm:p-4 max-w-none'}
      navbarSlot={
        <MeetingNavbar
          activePage="meeting-list"
          onNavigateMeetingList={() => navigate('/meeting-list')}
          onNavigateToDoList={() => navigate('/to-do-list')}
          onLogout={handleLogout}
          addMeetingSlot={
            <AddMeetingModal
              onCreateMeeting={handleCreateMeeting}
              isCreatingMeeting={isCreatingMeeting}
              createMeetingError={createMeetingError}
              onClearError={clearCreateMeetingError}
            />
          }
        />
      }
      toolbarSlot={showSplitView ? null : toolbar}
    >
      <div
        className={`grid min-h-0 flex-1 ${
          showSplitView ? 'gap-4 lg:gap-3 lg:grid-cols-[minmax(0,1.0fr)_minmax(420px,1.1fr)]' : 'gap-4'
        }`}
      >
        <div className={`flex min-h-0 flex-col ${showSplitView ? 'gap-4 p-4' : 'gap-4'}`}>
          {showSplitView ? toolbar : null}
          <div className="min-h-0 overflow-y-auto">
            <MeetingList
              isLoading={isLoading}
              error={error}
              items={filteredItems}
              selectedId={selectedMeetingId}
              onInfoClick={handleInfoClick}
              isCompact={showSplitView}
            />
          </div>
        </div>

        {showSplitView ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <MeetingDetailsContainer
              selectedMeetingId={selectedMeetingId}
              isInvalidRouteMeetingId={isInvalidRouteMeetingId}
              refreshMeetings={refreshMeetings}
            />
          </div>
        ) : null}
      </div>
    </MeetingLayoutTemplate>
  );
};

export default MeetingListPage;