import { ChangeEvent, FC, MouseEventHandler, useState } from 'react';
import MeetingTitleInput from '@atoms/MeetingTitleInput/MeetingTitleInput';
import DocumentUploadInput from '@atoms/DocumentUploadInput/DocumentUploadInput';
import NavbarTextButton from '@atoms/NavbarTextButton/NavbarTextButton';
import AddMeetingPopupHeader from '@organisms/AddMeetingPopupHeader/AddMeetingPopupHeader';
import '@organisms/AddMeetingPopup/AddMeetingPopup.css';
import { IAddMeetingPopupProps } from './IAddMeetingPopup';

const AddMeetingPopup: FC<IAddMeetingPopupProps> = ({ isOpen, onClose }) => {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [selectedDocumentName, setSelectedDocumentName] = useState<string>();

  const handleMeetingTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMeetingTitle(event.target.value);
  };

  const handleDocumentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setSelectedDocumentName(selectedFile?.name);
  };

  const handleConfirmCreationClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setMeetingTitle('');
    setSelectedDocumentName(undefined);
    onClose(event);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="add-meeting-popup-overlay" role="presentation">
      <div
        className="add-meeting-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-meeting-popup-title"
      >
        <AddMeetingPopupHeader title="NEW MEETING" titleId="add-meeting-popup-title" onClose={onClose} />

        <div className="add-meeting-popup-content">
          <div className="add-meeting-popup-form" aria-label="Add meeting form">
            <MeetingTitleInput value={meetingTitle} onChange={handleMeetingTitleChange} />

            <DocumentUploadInput
              onChange={handleDocumentChange}
              selectedFileName={selectedDocumentName}
              accept=".pdf,.doc,.docx,.txt"
            />
          </div>

          <div className="add-meeting-popup-confirm">
            <NavbarTextButton
              label="OK"
              className="navbar-button add-meeting-popup-confirm-button"
              onClick={handleConfirmCreationClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMeetingPopup;
