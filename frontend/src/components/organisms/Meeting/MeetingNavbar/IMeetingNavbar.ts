import { ReactNode } from 'react';
import { TNavbarPage } from '@molecules/Navbar/INavbar';

export interface IMeetingNavbarProps {
  activePage: TNavbarPage;
  addMeetingSlot?: ReactNode;
  onLogout?: () => void;
  onNavigateMeetingList: () => void;
  onNavigateToDoList: () => void;
}
