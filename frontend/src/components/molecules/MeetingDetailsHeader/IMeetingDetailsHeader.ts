import { MeetingStatus } from '@/hooks/useMeetings';

export interface IMeetingDetailsHeaderProps {
  meetingTitle: string;
  meetingDateLabel: string;
  status: MeetingStatus;
  isEditingTitle: boolean;
  editTitleValue: string;
  editDateValue: string;
  layout?: 'page' | 'panel';
  onEditTitleValueChange: (value: string) => void;
  onEditDateValueChange: (value: string) => void;
  onToggleEditTitle: () => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
}
