import { FC } from 'react';
import AttendeeListItem from '@molecules/List Rows/AttendeeListItem/AttendeeListItem';
import { getParticipantDisplayName } from '@/utils/participantUtils';
import { IAttendeeListProps } from './IAttendeeList';

const AttendeeList: FC<IAttendeeListProps> = ({ state, actions }) => {
  if (state.isLoading) {
    return (
      <div className="rounded-full border-[2px] border-[#1e3522] bg-[#efebe2] px-5 py-1 text-sm font-semibold text-[#1f2937]">
        Loading participants...
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="rounded-full border-[2px] border-[#8b3a3a] bg-[#f6d9d9] px-5 py-1 text-sm font-semibold text-[#6b1f1f]">
        {state.error}
      </div>
    );
  }

  if (state.participants.length === 0) {
    return (
      <div className="rounded-full border-[2px] border-[#1e3522] bg-[#efebe2] px-5 py-1 text-sm font-semibold text-[#1f2937]">
        No participants found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {state.participants.map((participant) => {
        const displayName = getParticipantDisplayName(
          participant.firstName,
          participant.lastName,
          participant.email,
        );
        const isEditingRow = state.editingParticipantId === participant.id;
        const isDeletingRow = state.deletingParticipantId === participant.id;
        const isSavingRow = state.savingParticipantId === participant.id;

        return (
          <AttendeeListItem
            key={participant.id}
            displayName={displayName}
            isEditing={isEditingRow}
            isDeleting={isDeletingRow}
            isSaving={isSavingRow}
            editValue={state.editParticipantNameValue}
            onEditValueChange={actions.onEditParticipantNameValueChange}
            onStartEdit={() => actions.onStartEditParticipant(participant.id, displayName)}
            onCancelEdit={actions.onCancelEditParticipant}
            onSave={() => actions.onSaveEditParticipant(participant.id)}
            onDelete={() => actions.onRequestDeleteParticipant(participant.id)}
          />
        );
      })}
    </div>
  );
};

export default AttendeeList;
