import { MouseEventHandler } from 'react';

export interface INavbarProps {
  onMeetingListClick: MouseEventHandler<HTMLButtonElement>;
  onToDoListClick: MouseEventHandler<HTMLButtonElement>;
  onAddMeetingClick: MouseEventHandler<HTMLButtonElement>;
  onLogoutClick: MouseEventHandler<HTMLButtonElement>;
}
