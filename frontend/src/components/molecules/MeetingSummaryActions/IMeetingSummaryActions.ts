import { MeetingStatus } from '@/hooks/useMeetings';

export interface IMeetingSummaryActionsProps {
  activeView: 'overview' | 'participants' | 'action-items';
  status: MeetingStatus;
  onOverview: () => void;
  onParticipants: () => void;
  onActionItems: () => void;
}
