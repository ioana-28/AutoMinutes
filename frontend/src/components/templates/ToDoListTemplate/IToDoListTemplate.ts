import { ReactNode } from 'react';
import { TNavbarPage } from '@organisms/Navbar/INavbar';

export interface IToDoListTemplateProps {
  activePage: TNavbarPage;
  children?: ReactNode;
  toolbarSlot?: ReactNode;
}