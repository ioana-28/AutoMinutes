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
  items: MeetingListItem[];
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
  onInfoClick: (id: number) => void;
}
