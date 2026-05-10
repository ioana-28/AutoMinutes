import { ReactNode } from 'react';

export interface IMeetingDetailsTemplateProps {
  meetingTitle: string;
  meetingDateLabel: string;
  isEditingTitle: boolean;
  editTitleValue: string;
  editDateValue: string;
  isSaving?: boolean;
  onEditTitleValueChange: (value: string) => void;
  onEditDateValueChange: (value: string) => void;
  onToggleEditTitle: () => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
  children?: ReactNode;
}
