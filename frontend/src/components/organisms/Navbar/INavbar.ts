import { MouseEventHandler } from 'react';

export type TNavbarPage = 'meeting-list' | 'to-do-list';

export interface INavbarProps {
  activePage: TNavbarPage;
  onMeetingListClick: MouseEventHandler<HTMLButtonElement>;
  onToDoListClick: MouseEventHandler<HTMLButtonElement>;
  onAddMeetingClick: MouseEventHandler<HTMLButtonElement>;
  onLogoutClick: MouseEventHandler<HTMLButtonElement>;
}
