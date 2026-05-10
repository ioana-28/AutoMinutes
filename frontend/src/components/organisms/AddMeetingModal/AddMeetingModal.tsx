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
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingFile, setMeetingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMeetingClick: MouseEventHandler<HTMLButtonElement> = () => {
    setIsAddMeetingOpen(true);
    setIsValidationOpen(false);
  };

  const handleCloseAddMeetingClick: MouseEventHandler<HTMLButtonElement> = () => {
    setIsAddMeetingOpen(false);
    setIsValidationOpen(false);
  };

  const handleCloseValidationClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setIsValidationOpen(false);
  };

  const handleMeetingTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMeetingTitle(event.target.value);
  };

  const handleDocumentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMeetingFile(event.target.files?.[0] ?? null);
  };

  const handleMeetingDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMeetingDate(event.target.value);
  };

  const handleConfirmCreationClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    if (!meetingTitle.trim() || !meetingFile) {
      setIsValidationOpen(true);
      return;
    }

    try {
      await onCreateMeeting(meetingTitle, meetingFile, meetingDate || null);
      setMeetingTitle('');
      setMeetingDate('');
      setMeetingFile(null);
      setIsValidationOpen(false);
      handleCloseAddMeetingClick(event);
    } catch {
      // Keep the popup open so the page can display the error message.
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button label="ADD MEETING" variant="nav" onClick={handleAddMeetingClick} />

      <Popup isOpen={isAddMeetingOpen} titleId="add-meeting-popup-title">
        <header className="flex w-full items-center justify-between gap-3 bg-canvas px-4 py-3">
          <h2 id="add-meeting-popup-title" className="m-0 text-lg font-bold text-black">
            NEW MEETING
          </h2>

          <div className="inline-flex items-center justify-center">
            <Button
              variant="icon-close"
              onClick={handleCloseAddMeetingClick}
              aria-label="Close add meeting popup"
              icon={<Icon name="close" className="h-[35px] w-[35px]" />}
            />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex flex-col gap-[14px]" aria-label="Add meeting form">
            <Input
              variant="text"
              value={meetingTitle}
              onChange={handleMeetingTitleChange}
              placeholder="Enter meeting title..."
            />

            <Input
              variant="date"
              value={meetingDate}
              onChange={handleMeetingDateChange}
              aria-label="Meeting date"
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button
                label="Choose File"
                variant="choose-file"
                onClick={handleUploadButtonClick}
                icon={<Icon name="file" className="h-5 w-5" />}
              />

              <span className="max-w-[220px] truncate rounded bg-surface-alt px-2 py-1 text-sm text-text-primary bg-[#e0e0e0]">
                {meetingFile?.name ?? 'No file selected'}
              </span>
            </div>

            <Input
              ref={fileInputRef}
              variant="file"
              className="hidden"
              onChange={handleDocumentChange}
              accept=".pdf,.docx"
            />
          </div>

          {createMeetingError ? (
            <div className="rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-text">
              {createMeetingError}
            </div>
          ) : null}

          <div className="mt-auto flex justify-center pt-1.5">
            <Button
              label={isCreatingMeeting ? 'Saving...' : 'OK'}
              variant="nav"
              className="min-w-[210px]"
              onClick={handleConfirmCreationClick}
              disabled={isCreatingMeeting}
            />
          </div>
        </div>
      </Popup>

      <Popup isOpen={isValidationOpen} titleId="meeting-validation-title" variant="confirm">
        <h2 id="meeting-validation-title">Missing details</h2>
        <p>Add a meeting title and upload a transcript before saving.</p>
        <div data-popup-actions>
          <Button label="OK" variant="nav" onClick={handleCloseValidationClick} />
        </div>
      </Popup>
    </>
  );
};

export default AddMeetingModal;
