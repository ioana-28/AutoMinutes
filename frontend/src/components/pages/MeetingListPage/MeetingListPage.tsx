import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import Button from '@atoms/Button/Button';
import Input from '@atoms/Input/Input';
import Select from '@atoms/Select/Select';
import Popup from '@atoms/Popup/Popup';
import GenericList from '@organisms/GenericList/GenericList';
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

const getStatusStyles = (status: MeetingStatus) => {
  switch (status) {
    case 'COMPLETED':
      return 'border-[#2f6f3b] bg-[#cfe7d2] text-[#1f3f26]';
    case 'PROCESSING':
      return 'border-[#9a7d3a] bg-[#f2e1b8] text-[#5f4a1e]';
    case 'FAILED':
      return 'border-[#b33a3a] bg-[#f4c7c7] text-[#6b1f1f]';
    case 'IDLE':
      return 'border-[#6b7280] bg-[#e5e7eb] text-[#374151]';
    default:
      return 'border-[#7f9d86] bg-[#efebe2] text-[#1f2937]';
  }
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

      if (file) {
        await createMeetingWithTranscript(title, 1, file);
      } else {
        await createMeeting(title, 1);
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
                <span
                  id="meeting-filter-title"
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3d5f46]"
                >
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
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setDraftFilterDate(event.target.value)
                }
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  label="Clear"
                  variant="nav"
                  onClick={handleClearFilter}
                  className="flex-1"
                />
                <Button
                  label="Apply"
                  variant="nav"
                  onClick={handleApplyFilter}
                  className="flex-1"
                />
              </div>
            </Popup>
          </div>

          <div className="min-w-[220px] flex-1">
            <Input
              value={searchTerm}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
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
        <GenericList
          items={filteredItems}
          getItemId={(item) => item.id}
          expandedId={expandedId}
          onToggleExpand={handleToggleExpand}
          emptyMessage="No meetings found."
          renderLeft={(item) => (
            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d5f46]">
                {item.dateLabel}
              </span>
              <span className="truncate text-lg font-semibold text-[#1f2937]">{item.title}</span>
            </div>
          )}
          renderRight={(item) => (
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full border ${getStatusStyles(item.status)}`.trim()}
                aria-label={`Status: ${item.status}`}
                title={item.status}
              />

              <Button
                variant="icon-ghost"
                onClick={() => handleInfoClick(item.id)}
                aria-label="Meeting details"
                className="h-9 w-9"
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
                      d="M12 16V12M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>
          )}
          renderExpanded={(item) => (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-[#1f2937]">
                {item.description || 'No description available yet.'}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4a5d50]">
                Status: {item.status}
              </p>
            </div>
          )}
        />
      ) : null}
    </MeetingLayoutTemplate>
  );
};

export default MeetingListPage;
