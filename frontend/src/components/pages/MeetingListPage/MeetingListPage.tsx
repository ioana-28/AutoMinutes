import { FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import AddMeetingModal from '@organisms/AddMeetingModal/AddMeetingModal';
import MeetingList, { MeetingListToolbar } from '@organisms/MeetingList/MeetingList';
import { useMeetings, MeetingStatus } from '@/hooks/useMeetings';

const MeetingListPage: FC = () => {
  const navigate = useNavigate();
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
        case 'date-asc': return (a.dateValue ?? 0) - (b.dateValue ?? 0);
        case 'title-asc': return a.title.localeCompare(b.title);
        case 'title-desc': return b.title.localeCompare(a.title);
        case 'status': {
          const order: Record<MeetingStatus, number> = {
            COMPLETED: 1, PROCESSING: 2, IDLE: 3, FAILED: 4, UNKNOWN: 5,
          };
          return order[a.status] - order[b.status];
        }
        case 'date-desc':
        default: return (b.dateValue ?? 0) - (a.dateValue ?? 0);
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
      <MeetingList
        isLoading={isLoading}
        error={error}
        items={filteredItems}
        expandedId={expandedId}
        onToggleExpand={handleToggleExpand}
        onInfoClick={(id) => navigate(`/meeting/${id}`)}
      />
    </MeetingLayoutTemplate>
  );
};

export default MeetingListPage;
