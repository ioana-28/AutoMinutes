export interface IMeetingDeleteDialogProps {
  isSaving: boolean;
  error: string | null;
  onConfirm: () => Promise<void> | void;
  registerOpen: (open: () => void) => void;
}
