export interface IAttendeeListItemProps {
  displayName: string;
  isSaving: boolean;
  isDeleting: boolean;
  onDelete: () => void;
}
