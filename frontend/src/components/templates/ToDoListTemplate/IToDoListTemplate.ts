import { ReactNode } from 'react';

export interface IToDoListTemplateProps {
  navbarSlot?: ReactNode;
  toolbarSlot?: ReactNode;
  children: ReactNode;
  modalSlot?: ReactNode;
  contentClassName?: string;
}
