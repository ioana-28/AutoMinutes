import { ReactNode } from 'react';

export type PopupVariant = 'compact' | 'popover';

export interface PopupProps {
  isOpen: boolean;
  titleId?: string;
  variant?: PopupVariant;
  overlayClassName?: string;
  panelClassName?: string;
  children: ReactNode;
}
