import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Popup from '@atoms/Popup/Popup';
import { IAttendeeDeleteDialogProps } from './IAttendeeDeleteDialog';

const AttendeeDeleteDialog: FC<IAttendeeDeleteDialogProps> = ({
  isOpen,
  isSaving,
  error,
  onCancel,
  onConfirm,
}) => {
  return (
    <Popup isOpen={isOpen} titleId="delete-attendee-title" variant="confirm">
      <h2 id="delete-attendee-title">Delete participant</h2>
      <p>Are you sure you want to delete this participant?</p>

      {error ? <div data-popup-error>{error}</div> : null}

      <div data-popup-actions>
        <Button label="Cancel" variant="nav" onClick={onCancel} />
        <Button
          label={isSaving ? 'Deleting...' : 'Delete'}
          variant="nav"
          onClick={onConfirm}
          data-popup-danger
          disabled={isSaving}
        />
      </div>
    </Popup>
  );
};

export default AttendeeDeleteDialog;
