export interface IMeetingDetailsHeaderProps {
  meetingTitle: string;
  meetingDateLabel: string;
  isEditingTitle: boolean;
  editTitleValue: string;
  editDateValue: string;
  onEditTitleValueChange: (value: string) => void;
  onEditDateValueChange: (value: string) => void;
  onToggleEditTitle: () => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
}
