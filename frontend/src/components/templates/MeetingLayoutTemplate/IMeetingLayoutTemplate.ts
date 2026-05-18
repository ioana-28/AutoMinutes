import { ReactNode } from 'react';
export interface IMeetingLayoutTemplateProps {
  navbarSlot?: ReactNode;
  toolbarSlot?: ReactNode;
  children?: ReactNode;
  contentClassName?: string;
}
