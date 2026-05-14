import { ReactNode } from 'react';

export type ListRowVariant = 'pill' | 'rounded' | 'card' | 'none';

export interface IListRowProps {
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  variant?: ListRowVariant;
  className?: string;
  onClick?: () => void;
}
