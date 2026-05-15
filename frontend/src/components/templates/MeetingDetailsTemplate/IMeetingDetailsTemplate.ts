import { ReactNode } from 'react';
import { MeetingStatus } from '@/hooks/useMeetings';

export interface IMeetingDetailsTemplateProps {
  meetingTitle: string;
  meetingDateLabel: string;
  status: MeetingStatus;
  isEditingTitle: boolean;
  editTitleValue: string;
  editDateValue: string;
  isSaving?: boolean;
  layout?: 'page' | 'panel';
  activeView?: 'overview' | 'participants' | 'action-items';
  onEditTitleValueChange: (value: string) => void;
  onEditDateValueChange: (value: string) => void;
  onToggleEditTitle: () => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
  onOverview: () => void;
  onParticipants: () => void;
  onActionItems: () => void;
  rightSlot?: ReactNode;
  children?: ReactNode;
}
