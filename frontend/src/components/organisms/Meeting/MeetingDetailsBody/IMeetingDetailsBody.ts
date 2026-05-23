import { ReactNode } from 'react';

export interface IMeetingDetailsBodyProps {
  leftSlot: ReactNode;
  rightSlot: ReactNode;
  layout?: 'page' | 'panel';
}
