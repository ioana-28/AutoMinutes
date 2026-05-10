import { FC, useEffect, useState } from 'react';
import Button from '@atoms/Button/Button';
import Popup from '@atoms/Popup/Popup';
import { IMeetingDeleteDialogProps } from './IMeetingDeleteDialog';

const MeetingDeleteDialog: FC<IMeetingDeleteDialogProps> = ({
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

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Popup isOpen={isOpen} titleId="delete-meeting-title" variant="confirm">
      <h2 id="delete-meeting-title">Delete meeting</h2>
      <p>Are you sure you want to delete this meeting?</p>

      {error ? <div data-popup-error>{error}</div> : null}

      <div data-popup-actions>
        <Button label="Cancel" variant="nav" onClick={handleCancel} />
        <Button
          label={isSaving ? 'Deleting...' : 'Delete'}
          variant="nav"
          onClick={handleConfirm}
          data-popup-danger
          disabled={isSaving}
        />
      </div>
    </Popup>
  );
};

export default MeetingDeleteDialog;
