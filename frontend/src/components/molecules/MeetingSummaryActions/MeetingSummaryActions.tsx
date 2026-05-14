import { FC } from 'react';
import Button from '@atoms/Button/Button';
import { IMeetingSummaryActionsProps } from './IMeetingSummaryActions';

const MeetingSummaryActions: FC<IMeetingSummaryActionsProps> = ({
  onParticipants,
  onActionItems,
}) => (
  <div className="flex flex-col items-start gap-8 mt-7">
    <Button
      label="Participants"
      variant="text-summary"
      onClick={onParticipants}
   
    />
    <Button
      label="Action Items"
      variant="text-summary"
      onClick={onActionItems}
    
    />
  </div>
);

export default MeetingSummaryActions;
