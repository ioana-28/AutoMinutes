import { ChangeEvent, FC, useEffect, useState } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Popup from '@atoms/Popup/Popup';
import Select from '@atoms/Select/Select';
import { IActionItem } from '@/hooks/useActionItems';
import { IAddActionItemModalProps } from './IAddActionItemModal';

const AddActionItemModal: FC<IAddActionItemModalProps> = ({
  onSave,
  isSaving = false,
  error,
  triggerVariant = 'nav',
  triggerLabel = 'ADD ACTION ITEM',
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);

  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleConfirm = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (!description.trim()) {
      setIsValidationOpen(true);
      return;
    }
    try {
      const payload: IActionItem = {
        id: 0,
        description,
        deadline,
        status,
      };
      await onSave(payload);
      setDescription('');
      setDeadline('');
      setStatus('Pending');
      handleClose();
    } catch {
      // Keep open for error display
    }
  };

  return (
    <>
      <Button
        label={triggerVariant === 'add' ? '+' : triggerLabel}
        variant={triggerVariant}
        onClick={handleOpen}
      />

      <Popup isOpen={isOpen} titleId="add-action-item-popup-title">
        <header className="flex w-full items-center justify-between gap-3 bg-canvas px-4 py-3">
          <h2 id="add-action-item-popup-title" className="m-0 text-lg font-bold text-black">
            NEW ACTION ITEM
          </h2>
          <Button
            variant="icon-close"
            onClick={handleClose}
            aria-label="Close"
            icon={<Icon name="close" className="h-[35px] w-[35px]" />}
          />
        </header>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex flex-col gap-[14px]">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter action item description..."
              className="min-h-[100px] w-full rounded-lg border border-[#7f9d86] bg-[#efebe2] p-3 text-[0.95rem] text-[#1f2937] focus:outline-none focus:ring-2 focus:ring-[#a4c3b2]"
            />

            <Input
              variant="date"
              value={deadline}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value)}
              aria-label="Deadline"
            />

            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Done', label: 'Done' },
              ]}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-text">
              {error}
            </div>
          )}

          <div className="mt-auto flex justify-center pt-1.5">
            <Button
              label={isSaving ? 'Saving...' : 'OK'}
              variant="nav"
              className="min-w-[210px]"
              onClick={handleConfirm}
              disabled={isSaving}
            />
          </div>
        </div>
      </Popup>

      <Popup isOpen={isValidationOpen} titleId="action-item-validation-title" variant="confirm">
        <h2 id="action-item-validation-title">Missing details</h2>
        <p>Please add a description for the action item.</p>
        <div data-popup-actions>
          <Button label="OK" variant="nav" onClick={() => setIsValidationOpen(false)} />
        </div>
      </Popup>
    </>
  );
};

export default AddActionItemModal;
