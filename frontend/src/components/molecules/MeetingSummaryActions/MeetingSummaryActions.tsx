import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import { IMeetingSummaryActionsProps } from './IMeetingSummaryActions';

const MeetingSummaryActions: FC<IMeetingSummaryActionsProps> = ({
  onParticipants,
  onActionItems,
}) => (
  <div className="flex items-center gap-4">
    <Button
      label="Participants"
      variant="link"
      onClick={onParticipants}
      icon={<Icon name="info" className="h-3.5 w-3.5" />}
    />
    <div className="h-4 w-[1px] bg-[#7f9d86]/30" />
    <Button
      label="Action Items"
      variant="link"
      onClick={onActionItems}
      icon={<Icon name="edit" className="h-3.5 w-3.5" />}
    />
  </div>
);

export default MeetingSummaryActions;
