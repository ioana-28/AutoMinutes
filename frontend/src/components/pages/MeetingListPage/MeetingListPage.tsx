import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import AddMeetingModal from '@organisms/AddMeetingModal/AddMeetingModal';
import MeetingList, { MeetingListToolbar } from '@organisms/MeetingList/MeetingList';
import { MeetingListItem, MeetingStatus } from '@organisms/MeetingList/IMeetingList';
import {
  createMeeting,
  createMeetingWithTranscript,
  getMeetings,
  MeetingApiResponse,
} from '@/api/meetingApi';

const normalizeStatus = (status?: string | null): MeetingStatus => {
  const normalized = status?.toUpperCase();
  if (
    normalized === 'IDLE' ||
    normalized === 'PROCESSING' ||
    normalized === 'COMPLETED' ||
    normalized === 'FAILED'
  ) {
    return normalized;
  }
  return 'UNKNOWN';
};

const formatMeetingDate = (meeting: MeetingApiResponse) => {
  const rawDate = meeting.createdAt ?? meeting.meetingDate ?? meeting.date;
  if (!rawDate) {
    return { label: 'No date', value: null };
  }
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) {
    return { label: 'No date', value: null };
  }
  return {
    label: parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    value: parsed.getTime(),
  };
};

const MeetingListPage: FC = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<MeetingApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('date-desc');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [draftFilterDate, setDraftFilterDate] = useState('');
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [createMeetingError, setCreateMeetingError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMeetings(controller.signal);
        setMeetings(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError('Unable to load meetings right now.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();

    return () => controller.abort();
  }, [reloadToken]);

  const items = useMemo<MeetingListItem[]>(
    () =>
      meetings.map((meeting) => {
        const { label, value } = formatMeetingDate(meeting);

        return {
          id: meeting.id,
          title: meeting.title?.trim() || 'Untitled meeting',
          description: meeting.description?.trim() || '',
          dateLabel: label,
          dateValue: value,
          status: normalizeStatus(meeting.aiStatus),
        };
      }),
    [meetings],
  );

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
            if (!item.dateValue) {
              return false;
            }
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

    const sorted = [...filteredWithFilters].sort((a, b) => {
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

    return sorted;
  }, [items, searchTerm, sortKey, filterDate]);

  const handleToggleExpand = (id: string | number) => {
    setExpandedId((prev) => (prev === id ? null : Number(id)));
  };

  const handleInfoClick = (id: number) => {
    navigate(`/meeting/${id}`);
  };

  const handleNavigateMeetingList = () => {
    navigate('/meeting-list');
  };

  const handleNavigateToDoList = () => {
    navigate('/to-do-list');
  };

  const handleOpenFilter = () => {
    setDraftFilterDate(filterDate);
    setIsFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
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

  const handleCreateMeeting = async (
    title: string,
    file: File | null,
    meetingDate: string | null,
  ) => {
    try {
      setIsCreatingMeeting(true);
      setCreateMeetingError(null);

      if (file) {
        await createMeetingWithTranscript(title, 1, file, meetingDate);
      } else {
        await createMeeting(title, 1, meetingDate);
      }

      setReloadToken((prev) => prev + 1);
    } catch (error) {
      setCreateMeetingError('Unable to create meeting right now.');
      throw error;
    } finally {
      setIsCreatingMeeting(false);
    }
  };

  return (
    <MeetingLayoutTemplate
      activePage="meeting-list"
      contentClassName="max-w-none"
      onNavigateMeetingList={handleNavigateMeetingList}
      onNavigateToDoList={handleNavigateToDoList}
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
          onOpenFilter={handleOpenFilter}
          onCloseFilter={handleCloseFilter}
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
        onInfoClick={handleInfoClick}
      />
    </MeetingLayoutTemplate>
  );
};

export default MeetingListPage;
