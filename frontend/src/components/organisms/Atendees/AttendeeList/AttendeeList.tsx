import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import GenericList from '@molecules/GenericList/GenericList';
import { getParticipantDisplayName } from '@/utils/participantUtils';
import { IAttendeeListProps } from './IAttendeeList';
import { MeetingParticipantApiResponse } from '@/api/userApi';

const AttendeeList: FC<IAttendeeListProps> = ({ state, actions, variant = 'default' }) => {
  const isPanel = variant === 'panel';

  if (state.isLoading) {
    return (
      <div
        className={`rounded-lg border border-dashed border-[#7f9d86]/40 bg-[#efebe2] text-center text-[#1f2937]/60 ${isPanel ? 'p-4 text-xs' : 'p-8'}`}
      >
        Loading participants...
      </div>
    );
  }

  if (state.error) {
    return (
      <div
        className={`rounded-lg border border-[#b33a3a]/30 bg-[#f4c7c7]/30 text-center text-[#6b1f1f] ${isPanel ? 'p-4 text-xs' : 'p-6'}`}
      >
        {state.error}
      </div>
    );
  }

  return (
    <GenericList<MeetingParticipantApiResponse>
      items={state.participants}
      variant={variant}
      getItemId={(p) => p.id}
      emptyMessage="No participants found."
      renderLeft={(participant) => (
        <span className={`font-semibold text-[#1f2937] ${isPanel ? 'text-xs' : 'text-sm'}`}>
          {getParticipantDisplayName(
            participant.firstName,
            participant.lastName,
            participant.email,
          )}
        </span>
      )}
      renderRight={(participant) => (
        <Button
          variant="icon-delete"
          onClick={() => actions.onRequestDeleteParticipant(participant.id)}
          aria-label="Delete participant"
          className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
          icon={<Icon name="trash" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
          disabled={
            state.deletingParticipantId === participant.id ||
            state.savingParticipantId === participant.id
          }
        />
      )}
    />
  );
};

export default AttendeeList;
