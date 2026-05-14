import { ChangeEvent, FC, MouseEventHandler, useRef, useState } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Popup from '@atoms/Popup/Popup';
import { IAddMeetingModalProps } from './IAddMeetingModal';

const AddMeetingModal: FC<IAddMeetingModalProps> = ({
  onCreateMeeting,
  isCreatingMeeting = false,
  createMeetingError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (!title.trim() || !file) {
      setIsValidationOpen(true);
      return;
    }
    try {
      await onCreateMeeting(title, file, date || null);
      setTitle('');
      setDate('');
      setFile(null);
      setIsOpen(false);
    } catch {
      // Keep open for error display
    }
  };

  return (
    <>
      <Button label="ADD MEETING" variant="nav" onClick={() => setIsOpen(true)} />

      <Popup isOpen={isOpen} titleId="add-meeting-popup-title">
        <header className="flex w-full items-center justify-between gap-3 bg-canvas px-4 py-3">
          <h2 id="add-meeting-popup-title" className="m-0 text-lg font-bold text-black">
            NEW MEETING
          </h2>
          <Button
            variant="icon-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            icon={<Icon name="close" className="h-[35px] w-[35px]" />}
          />
        </header>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex flex-col gap-[14px]">
            <Input
              variant="text"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Enter meeting title..."
            />

            <Input
              variant="date"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
              aria-label="Meeting date"
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button
                label="Choose File"
                variant="choose-file"
                onClick={() => fileInputRef.current?.click()}
                icon={<Icon name="file" className="h-5 w-5" />}
              />
              <span className="max-w-[220px] truncate rounded bg-[#e0e0e0] px-2 py-1 text-sm text-text-primary">
                {file?.name ?? 'No file selected'}
              </span>
            </div>

            <Input
              ref={fileInputRef}
              variant="file"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] ?? null)}
              accept=".pdf,.docx"
            />
          </div>

          {createMeetingError && (
            <div className="rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-text">
              {createMeetingError}
            </div>
          )}

          <div className="mt-auto flex justify-center pt-1.5">
            <Button
              label={isCreatingMeeting ? 'Saving...' : 'OK'}
              variant="nav"
              className="min-w-[210px]"
              onClick={handleConfirm}
              disabled={isCreatingMeeting}
            />
          </div>
        </div>
      </Popup>

      <Popup isOpen={isValidationOpen} titleId="meeting-validation-title" variant="confirm">
        <h2 id="meeting-validation-title">Missing details</h2>
        <p>Add a meeting title and upload a transcript before saving.</p>
        <div data-popup-actions>
          <Button label="OK" variant="nav" onClick={() => setIsValidationOpen(false)} />
        </div>
      </Popup>
    </>
  );
};

export default AddMeetingModal;
