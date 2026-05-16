import { FC, useEffect, useState } from 'react';
import Button from '@atoms/Button/Button';
import Popup from '@atoms/Popup/Popup';
import {
  IBaseConfirmationDialogProps,
  IConfirmationDialogProps,
  IMeetingConfirmationDialogProps,
} from './IConfirmationDialog';

const ConfirmationDialog: FC<IConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  isSaving,
  error,
  onConfirm,
  onCancel,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  titleId = 'confirmation-dialog-title',
}) => {
  return (
    <Popup isOpen={isOpen} titleId={titleId} variant="confirm">
      <h2 id={titleId}>{title}</h2>
      <p>{message}</p>

      {error ? <div data-popup-error>{error}</div> : null}

      <div data-popup-actions>
        <Button
          label={cancelLabel}
          variant="reprocess"
          onClick={onCancel}
          className="px-6 py-1.5 h-auto w-auto"
        />
        <Button
          label={isSaving ? `${confirmLabel}ing...` : confirmLabel}
          variant="reprocess"
          onClick={onConfirm}
          className={`px-6 py-1.5 h-auto w-auto border-[#b33a3a]/40 bg-[#f4c7c7]/40 text-[#6b1f1f] hover:bg-[#f4c7c7]/60 hover:border-[#b33a3a]/60 ${
            isSaving ? 'opacity-50' : ''
          }`}
          disabled={isSaving}
        />
      </div>
    </Popup>
  );
};

export const AttendeeConfirmationDialog: FC<IBaseConfirmationDialogProps> = (props) => (
  <ConfirmationDialog
    {...props}
    title="Delete participant"
    message="Are you sure you want to delete this participant?"
    titleId="delete-attendee-title"
  />
);

export const ActionItemConfirmationDialog: FC<IBaseConfirmationDialogProps> = (props) => (
  <ConfirmationDialog
    {...props}
    title="Delete action item"
    message="Are you sure you want to delete this action item?"
    titleId="delete-action-item-title"
  />
);

export const MeetingConfirmationDialog: FC<IMeetingConfirmationDialogProps> = ({
  isSaving,
  error,
  onConfirm,
  registerOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    registerOpen(() => setIsOpen(true));
    return () => registerOpen(() => undefined);
  }, [registerOpen]);

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      isSaving={isSaving}
      error={error}
      onConfirm={onConfirm}
      onCancel={handleCancel}
      title="Delete meeting"
      message="Are you sure you want to delete this meeting?"
      titleId="delete-meeting-title"
    />
  );
};

export default ConfirmationDialog;
