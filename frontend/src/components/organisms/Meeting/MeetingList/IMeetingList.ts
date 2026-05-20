export type MeetingStatus = 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'UNKNOWN';

export interface MeetingListItem {
  id: number;
  title: string;
  description: string;
  actionItemsCount: number;
  attendeesCount: number;
  dateLabel: string;
  dateValue: number | null;
  status: MeetingStatus;
}

export interface IMeetingListProps {
  isLoading: boolean;
  error: string | null;
  items: MeetingListItem[];
  selectedId?: number | null;
  onInfoClick: (id: number) => void;
}

export interface IMeetingListToolbarProps {
  searchTerm: string;
  sortKey: string;
  isFilterOpen: boolean;
  draftStartDate: string;
  draftEndDate: string;
  draftStatusFilter: string;
  onSearchTermChange: (value: string) => void;
  onSortKeyChange: (value: string) => void;
  onOpenFilter: () => void;
  onCloseFilter: () => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
  onDraftStartDateChange: (value: string) => void;
  onDraftEndDateChange: (value: string) => void;
  onDraftStatusFilterChange: (value: string) => void;
}
