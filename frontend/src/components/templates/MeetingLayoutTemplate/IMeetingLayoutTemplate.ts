import { ReactNode } from 'react';
import { TNavbarPage } from '@organisms/Navbar/INavbar';

export interface IMeetingLayoutTemplateProps {
  activePage: TNavbarPage;
  children?: ReactNode;
  contentClassName?: string;
  toolbarSlot?: ReactNode;
  onCreateMeeting?: (title: string, file: File | null, meetingDate: string | null) => Promise<void> | void;
  isCreatingMeeting?: boolean;
  createMeetingError?: string | null;
}
