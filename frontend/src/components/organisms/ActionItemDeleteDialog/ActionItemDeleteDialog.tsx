import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Popup from '@atoms/Popup/Popup';
import { IActionItemDeleteDialogProps } from './IActionItemDeleteDialog';

const ActionItemDeleteDialog: FC<IActionItemDeleteDialogProps> = ({
  isOpen,
  isSaving,
  error,
  onCancel,
  onConfirm,
}) => {
  return (
    <Popup isOpen={isOpen} titleId="delete-action-item-title" variant="confirm">
      <h2 id="delete-action-item-title">Delete action item</h2>
      <p>Are you sure you want to delete this action item?</p>

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

export default ActionItemDeleteDialog;
