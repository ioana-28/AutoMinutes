export interface IAttendeeDeleteDialogProps {
  isOpen: boolean;
  isSaving: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}
