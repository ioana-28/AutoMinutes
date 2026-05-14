import { ReactNode } from 'react';

export type TNavbarPage = 'meeting-list' | 'to-do-list' | 'admin';

export interface INavbarProps {
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}
