import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import { IMeetingSummaryActionsProps } from './IMeetingSummaryActions';

const MeetingSummaryActions: FC<IMeetingSummaryActionsProps> = ({
  activeView,
  onOverview,
  onParticipants,
  onActionItems,
}) => (
  <div className="flex items-center w-full">
    <div className="flex items-center gap-4">
      <Button
        label="Files"
        variant={activeView === 'overview' ? 'nav-active' : 'link'}
        onClick={onOverview}
        icon={<Icon name="file" className="h-3.5 w-3.5" />}
      />
      <div className="h-4 w-[1px] bg-[#7f9d86]/30" />
      <Button
        label="Participants"
        variant={activeView === 'participants' ? 'nav-active' : 'link'}
        onClick={onParticipants}
        icon={<Icon name="info" className="h-3.5 w-3.5" />}
      />
      <div className="h-4 w-[1px] bg-[#7f9d86]/30" />
      <Button
        label="Action Items"
        variant={activeView === 'action-items' ? 'nav-active' : 'link'}
        onClick={onActionItems}
        icon={<Icon name="edit" className="h-3.5 w-3.5" />}
      />
    </div>
  </div>
);

export default MeetingSummaryActions;
