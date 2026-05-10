import { ReactNode } from 'react';
import { TNavbarPage } from '@organisms/Navbar/INavbar';

export interface IMeetingLayoutTemplateProps {
  activePage: TNavbarPage;
  children?: ReactNode;
  contentClassName?: string;
  toolbarSlot?: ReactNode;
  addMeetingSlot?: ReactNode;
  onNavigateMeetingList: () => void;
  onNavigateToDoList: () => void;
}
