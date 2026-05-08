import { ChangeEvent, FC, MouseEventHandler, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@organisms/Navbar/Navbar';
import Button from '@atoms/Button/Button';
import Input from '@atoms/Input/Input';
import Popup from '@atoms/Popup/Popup';
import { IMeetingLayoutTemplateProps } from './IMeetingLayoutTemplate';
import { useRef } from 'react';

const MeetingLayoutTemplate: FC<IMeetingLayoutTemplateProps> = ({ activePage, children }) => {
  const navigate = useNavigate();
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');

  const handleMeetingListClick: MouseEventHandler<HTMLButtonElement> = () => {
    navigate('/meeting-list');
  };

  const handleToDoListClick: MouseEventHandler<HTMLButtonElement> = () => {
    navigate('/to-do-list');
  };

  const handleAddMeetingClick: MouseEventHandler<HTMLButtonElement> = () => {
    setIsAddMeetingOpen(true);
  };

  const handleCloseAddMeetingClick: MouseEventHandler<HTMLButtonElement> = () => {
    setIsAddMeetingOpen(false);
  };

  const handleMeetingTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMeetingTitle(event.target.value);
  };

  const handleDocumentChange = (_event: ChangeEvent<HTMLInputElement>) => undefined;

  const handleConfirmCreationClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setMeetingTitle('');
    handleCloseAddMeetingClick(event);
  };


  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="min-h-screen bg-[#cad2c5]">
      <Navbar
        leftSlot={
          <>
            <Button
              label="MEETING LIST"
              variant={activePage === 'meeting-list' ? 'nav-active' : 'nav'}
              onClick={handleMeetingListClick}
            />
            <Button
              label="TO DO LIST"
              variant={activePage === 'to-do-list' ? 'nav-active' : 'nav'}
              onClick={handleToDoListClick}
            />
          </>
        }
        rightSlot={
          <>
            <Button label="ADD MEETING" variant="nav" onClick={handleAddMeetingClick} />
          </>
        }
      />

      <section className="mx-auto w-full max-w-[1200px] p-6">{children}</section>

      <Popup isOpen={isAddMeetingOpen} titleId="add-meeting-popup-title">
        <header className="flex w-full items-center justify-between gap-3 bg-[#cad2c5] px-4 py-3">
          <h2 id="add-meeting-popup-title" className="m-0 text-lg font-bold text-black">
            NEW MEETING
          </h2>

          <div className="inline-flex items-center justify-center">
            <Button
              variant="icon-close"
              onClick={handleCloseAddMeetingClick}
              aria-label="Close add meeting popup"
              icon={
                <svg
                  className="h-[35px] w-[35px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
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

            <Button
              label="Choose File"
              variant="choose-file"
              onClick={handleUploadButtonClick}
              icon={
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
              }
            />

            <Input
              ref={fileInputRef}
              variant="file"
              className="hidden" // This hides the "No file chosen" text
              onChange={handleDocumentChange}
              accept=".pdf,.docx"
            />
          </div>

          <div className="mt-auto flex justify-center pt-1.5">
            <Button
              label="OK"
              variant="nav"
              className="min-w-[210px]"
              onClick={handleConfirmCreationClick}
            />
          </div>
        </div>
      </Popup>
    </main>
  );
};

export default MeetingLayoutTemplate;
