export interface IMeetingSummaryActionsProps {
  activeView: 'overview' | 'participants' | 'action-items';
  onOverview: () => void;
  onParticipants: () => void;
  onActionItems: () => void;
}
