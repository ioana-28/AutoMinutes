import { ReactNode } from 'react';

export type TNavbarPage = 'meeting-list' | 'to-do-list';

export interface INavbarProps {
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}
