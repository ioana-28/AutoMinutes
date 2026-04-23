import { FC } from 'react';
import CloseIconButton from '@atoms/CloseIconButton/CloseIconButton';
import '@organisms/AddMeetingPopupHeader/AddMeetingPopupHeader.css';
import { IAddMeetingPopupHeaderProps } from './IAddMeetingPopupHeader';

const AddMeetingPopupHeader: FC<IAddMeetingPopupHeaderProps> = ({
  title = 'NEW MEETING',
  titleId,
  onClose,
}) => (
  <header className="add-meeting-popup-header">
    <h2 id={titleId} className="add-meeting-popup-header-title">
      {title}
    </h2>

    <div className="add-meeting-popup-header-close">
      <CloseIconButton onClick={onClose} ariaLabel="Close add meeting popup" />
    </div>
  </header>
);

export default AddMeetingPopupHeader;
