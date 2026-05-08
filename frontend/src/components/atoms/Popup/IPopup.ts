import { ReactNode } from 'react';

export type PopupVariant = 'compact';

export interface PopupProps {
  isOpen: boolean;
  titleId?: string;
  variant?: PopupVariant;
  children: ReactNode;
}
