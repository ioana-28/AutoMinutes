export interface IActionItemDeleteDialogProps {
  isOpen: boolean;
  isSaving: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}
