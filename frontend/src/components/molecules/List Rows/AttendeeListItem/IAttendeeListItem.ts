export interface IAttendeeListItemProps {
  displayName: string;
  isEditing: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  editValue: string;
  onEditValueChange: (value: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
}
