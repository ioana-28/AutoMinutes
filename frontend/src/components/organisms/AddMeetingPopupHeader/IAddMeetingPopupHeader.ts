import { MouseEventHandler } from 'react';

export interface IAddMeetingPopupHeaderProps {
  title?: string;
  titleId?: string;
  onClose: MouseEventHandler<HTMLButtonElement>;
}
