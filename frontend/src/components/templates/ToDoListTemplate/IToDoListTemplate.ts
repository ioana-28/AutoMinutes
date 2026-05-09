import { ReactNode } from 'react';
import { TNavbarPage } from '@organisms/Navbar/INavbar';

export interface IMeetingLayoutTemplateProps {
  activePage: TNavbarPage;
  children?: ReactNode;
  toolbarSlot?: ReactNode;
}
