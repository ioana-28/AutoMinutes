import { ReactNode } from 'react';

export interface IMeetingDetailsTemplateProps {
  meetingTitle: string;
  isEditingTitle: boolean;
  editTitleValue: string;
  isSaving?: boolean;
  onEditTitleValueChange: (value: string) => void;
  onToggleEditTitle: () => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
  children?: ReactNode;
}
