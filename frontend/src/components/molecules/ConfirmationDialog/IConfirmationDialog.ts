export interface IBaseConfirmationDialogProps {
  isOpen: boolean;
  isSaving: boolean;
  error: string | null;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  titleId?: string;
}

export interface IConfirmationDialogProps extends IBaseConfirmationDialogProps {
  title: string;
  message: string;
}

export interface IMeetingConfirmationDialogProps {
  isSaving: boolean;
  error: string | null;
  onConfirm: () => Promise<void> | void;
  registerOpen: (open: () => void) => void;
}
