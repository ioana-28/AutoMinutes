import { ChangeEvent, FC, useRef, useState } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Popup from '@atoms/Popup/Popup';
import { IAddMeetingModalProps } from './IAddMeetingModal';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

const AddMeetingModal: FC<IAddMeetingModalProps> = ({
  onCreateMeeting,
  isCreatingMeeting = false,
  createMeetingError,
  onClearError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearErrors = () => {
    setLocalError(null);
    onClearError?.();
  };

  const handleConfirm = async (event: React.MouseEvent) => {
    event.preventDefault();
    clearErrors();

    if (!title.trim()) {
      setLocalError(ERROR_MESSAGES.MEETING_TITLE_REQUIRED);
      return;
    }

    if (!file) {
      setLocalError(ERROR_MESSAGES.MEETING_TRANSCRIPT_REQUIRED);
      return;
    }

    if (file.size === 0) {
      setLocalError(ERROR_MESSAGES.MEETING_TRANSCRIPT_EMPTY);
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

  const displayError = localError || createMeetingError;

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
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                clearErrors();
                setTitle(e.target.value);
              }}
              placeholder="Enter meeting title..."
            />

            <Input
              variant="date"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                clearErrors();
                setDate(e.target.value);
              }}
              aria-label="Meeting date"
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button
                label="Choose File"
                variant="choose-file"
                onClick={() => {
                  clearErrors();
                  fileInputRef.current?.click();
                }}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                clearErrors();
                setFile(e.target.files?.[0] ?? null);
              }}
              accept=".pdf,.docx"
            />
          </div>

          {displayError && (
            <div className="rounded-lg border border-[#b33a3a]/30 bg-[#f4c7c7]/30 px-3 py-2 text-xs text-[#6b1f1f]">
              {displayError}
            </div>
          )}

          <div className="mt-4 flex justify-center gap-3">
            <Button
              label="Cancel"
              variant="icon-ghost"
              className="px-6 py-1.5 h-auto w-auto"
              onClick={() => {
                setIsOpen(false);
                clearErrors();
              }}
            />
            <Button
              label={isCreatingMeeting ? 'Saving...' : 'Create Meeting'}
              variant="reprocess"
              className="min-w-[140px] px-6 py-1.5 h-auto"
              onClick={handleConfirm}
              disabled={isCreatingMeeting || !!displayError}
            />
          </div>
        </div>
      </Popup>
    </>
  );
};

export default AddMeetingModal;
