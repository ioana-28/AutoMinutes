import { FC, useEffect, useMemo, useState } from 'react';
import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import Button from '@atoms/Button/Button';
import Input from '@atoms/Input/Input';
import Select from '@atoms/Select/Select';
import Popup from '@atoms/Popup/Popup';
import MeetingList from '@organisms/MeetingList/MeetingList';
import { MeetingListItem, MeetingStatus } from '@organisms/MeetingList/IMeetingList';

interface MeetingApiResponse {
  id: number;
  title?: string | null;
  description?: string | null;
  aiStatus?: string | null;
  createdAt?: string | null;
  meetingDate?: string | null;
  date?: string | null;
}

const normalizeStatus = (status?: string | null): MeetingStatus => {
  const normalized = status?.toUpperCase();
  if (normalized === 'IDLE' || normalized === 'PROCESSING' || normalized === 'COMPLETED' || normalized === 'FAILED') {
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

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
const normalizedApiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
const meetingsEndpoint = `${normalizedApiBaseUrl}/api/meetings`;
const meetingsWithTranscriptEndpoint = `${normalizedApiBaseUrl}/api/meetings/create-with-transcript`;

const MeetingListPage: FC = () => {
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
        const response = await fetch(meetingsEndpoint, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = (await response.json()) as MeetingApiResponse[];
        setMeetings(Array.isArray(data) ? data : []);
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

  const items = useMemo<MeetingListItem[]>(() =>
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
    }), [meetings]);

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
  }, [items, searchTerm, sortKey]);

  const handleToggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleInfoClick = (_id: number) => undefined;

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

  const handleCreateMeeting = async (title: string, file: File | null) => {
    try {
      setIsCreatingMeeting(true);
      setCreateMeetingError(null);

      const response = file
        ? await fetch(meetingsWithTranscriptEndpoint, {
            method: 'POST',
            body: (() => {
              const formData = new FormData();
              formData.append('title', title);
              formData.append('userId', '1');
              formData.append('file', file);
              return formData;
            })(),
          })
        : await fetch(meetingsEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              createdByUserId: 1,
            }),
          });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
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
      onCreateMeeting={handleCreateMeeting}
      isCreatingMeeting={isCreatingMeeting}
      createMeetingError={createMeetingError}
      toolbarSlot={
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Button
              variant="icon-ghost"
              onClick={handleOpenFilter}
              aria-label="Filter meetings"
              icon={
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M3 5H21M6 12H18M10 19H14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />

            <Popup
              isOpen={isFilterOpen}
              titleId="meeting-filter-title"
              variant="popover"
              overlayClassName="left-0 top-full mt-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span id="meeting-filter-title" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3d5f46]">
                  Filters
                </span>
                <Button
                  variant="icon-close"
                  onClick={handleCloseFilter}
                  aria-label="Close filter popup"
                  className="h-8 w-8"
                  icon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M6 6L18 18M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                />
              </div>

              <Input
                type="date"
                value={draftFilterDate}
                onChange={(event) => setDraftFilterDate(event.target.value)}
              />

              <div className="flex flex-wrap gap-2">
                <Button label="Clear" variant="nav" onClick={handleClearFilter} className="flex-1" />
                <Button label="Apply" variant="nav" onClick={handleApplyFilter} className="flex-1" />
              </div>
            </Popup>
          </div>

          <div className="min-w-[220px] flex-1">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search meetings..."
            />
          </div>

          <div className="min-w-[190px]">
            <Select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value)}
              options={[
                { value: 'date-desc', label: 'Newest first' },
                { value: 'date-asc', label: 'Oldest first' },
                { value: 'title-asc', label: 'Title A-Z' },
                { value: 'title-desc', label: 'Title Z-A' },
                { value: 'status', label: 'Status' },
              ]}
            />
          </div>
        </div>
      }
    >
      {isLoading ? (
        <div className="rounded-2xl border border-dashed border-[#7f9d86] bg-[#efebe2] p-10 text-center text-[#1f2937]">
          Loading meetings...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-[#b33a3a] bg-[#f4c7c7] p-6 text-center text-[#6b1f1f]">
          {error}
        </div>
      ) : null}

      {!isLoading && !error ? (
        <MeetingList
          items={filteredItems}
          expandedId={expandedId}
          onToggleExpand={handleToggleExpand}
          onInfoClick={handleInfoClick}
        />
      ) : null}

    </MeetingLayoutTemplate>
  );
};

export default MeetingListPage;
