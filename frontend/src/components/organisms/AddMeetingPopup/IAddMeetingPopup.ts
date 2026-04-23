import { MouseEventHandler } from 'react';

export interface IAddMeetingPopupProps {
  isOpen: boolean;
  onClose: MouseEventHandler<HTMLButtonElement>;
}
