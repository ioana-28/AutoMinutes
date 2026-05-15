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
      <Button
        label="Add Meeting"
        variant="reprocess"
        className="bg-[#a4c3b2] hover:bg-[#8da89a] border-transparent text-[#1f2937]"
        onClick={() => setIsOpen(true)}
      />

      <Popup isOpen={isOpen} titleId="add-meeting-popup-title">
        <header className="flex w-full items-center justify-between gap-3 border-b border-[#7f9d86]/20 bg-[#cad2c5]/40 px-5 py-3">
          <h2
            id="add-meeting-popup-title"
            className="m-0 text-sm font-bold uppercase tracking-widest text-[#3d5f46]"
          >
            New Meeting
          </h2>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-6 bg-[#efebe2]">
          <div className="flex flex-col gap-4">
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
                icon={<Icon name="file" className="h-4 w-4" />}
              />
              <span className="max-w-[220px] truncate rounded-md bg-[#7f9d86]/10 px-2 py-1 text-xs font-medium text-[#1f2937]/70">
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
            <div className="rounded-lg border border-[#b33a3a]/30 bg-[#f4c7c7]/30 px-3 py-2 text-xs text-[#6b1f1f]">
              {createMeetingError}
            </div>
          )}

          <div className="mt-4 flex justify-center gap-3">
            <Button
              label="Cancel"
              variant="icon-ghost"
              className="px-6 py-1.5 h-auto w-auto"
              onClick={() => setIsOpen(false)}
            />
            <Button
              label={isCreatingMeeting ? 'Saving...' : 'Create Meeting'}
              variant="reprocess"
              className="min-w-[140px] px-6 py-1.5 h-auto"
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
          <Button
            label="OK"
            variant="reprocess"
            className="px-8 py-1.5 h-auto"
            onClick={() => setIsValidationOpen(false)}
          />
        </div>
      </Popup>
    </>
  );
};

export default AddMeetingModal;
