export type MeetingStatus = 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'UNKNOWN';

export interface MeetingListItem {
  id: number;
  title: string;
  description: string;
  dateLabel: string;
  dateValue: number | null;
  status: MeetingStatus;
}

export interface IMeetingListProps {
  isLoading: boolean;
  error: string | null;
  items: MeetingListItem[];
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
  onInfoClick: (id: number) => void;
}

export interface IMeetingListToolbarProps {
  searchTerm: string;
  sortKey: string;
  isFilterOpen: boolean;
  draftFilterDate: string;
  onSearchTermChange: (value: string) => void;
  onSortKeyChange: (value: string) => void;
  onOpenFilter: () => void;
  onCloseFilter: () => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
  onDraftFilterDateChange: (value: string) => void;
}
