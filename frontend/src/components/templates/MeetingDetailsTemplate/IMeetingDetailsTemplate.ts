import { ReactNode } from 'react';

export interface IMeetingDetailsTemplateProps {
  layout?: 'page' | 'panel';
  headerSlot?: ReactNode;
  summarySlot?: ReactNode;
  panelTopSlot?: ReactNode;
  rightSlot?: ReactNode;
  children?: ReactNode;
}
