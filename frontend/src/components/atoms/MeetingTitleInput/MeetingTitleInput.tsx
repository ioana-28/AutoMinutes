import { FC } from 'react';
import '@atoms/MeetingTitleInput/MeetingTitleInput.css';
import { IMeetingTitleInputProps } from './IMeetingTitleInput';

const MeetingTitleInput: FC<IMeetingTitleInputProps> = ({
  id = 'meeting-title',

  value,
  onChange,
  placeholder = 'Enter meeting title...',
  ...rest
}) => (
  <div className="meeting-title-input-field">
   
    <input
      id={id}
      className="meeting-title-input-control"
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
    />
  </div>
);

export default MeetingTitleInput;
