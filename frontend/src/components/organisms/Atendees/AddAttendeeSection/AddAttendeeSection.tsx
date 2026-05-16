import { ChangeEvent, FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import UserSearchResultItem from '@molecules/List Rows/UserSearchResultItem/UserSearchResultItem';
import { getParticipantFullName } from '@/utils/participantUtils';
import { IAddAttendeeSectionProps } from './IAddAttendeeSection';

const AddAttendeeSection: FC<IAddAttendeeSectionProps> = ({
  state,
  actions,
  variant = 'default',
}) => {
  const isPanel = variant === 'panel';

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border border-[#7f9d86]/30 bg-[#efebe2] px-4 py-3 shadow-sm ${
        isPanel ? 'mb-2' : 'mb-3'
      }`}
    >
      {state.isLoading ? (
        <span className="mr-3 flex-1 py-1 text-sm font-semibold text-[#1f2937]">
          Loading users...
        </span>
      ) : state.error ? (
        <span className="mr-3 flex-1 py-1 text-sm font-semibold text-[#6b1f1f]">{state.error}</span>
      ) : state.availableUsers.length === 0 ? (
        <span className="mr-3 flex-1 py-1 text-sm font-semibold text-[#1f2937]">
          No available users to add.
        </span>
      ) : (
        <div className="mr-3 flex min-w-0 flex-1 flex-col gap-2">
          <Input
            value={state.searchTerm}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              actions.onSearchChange(event.target.value)
            }
            className="rounded-md border border-[#7f9d86]/20 bg-[#efebe2] px-3 py-1.5 text-sm font-semibold text-[#1f2937] outline-none focus:ring-1 focus:ring-[#7f9d86]"
            aria-label="Search participant user"
            placeholder="Search by email or name..."
          />

          {state.searchTerm.trim() && state.filteredUsers.length === 0 ? (
            <div className="rounded-md border border-[#7f9d86]/20 bg-[#efebe2] px-3 py-1 text-xs font-semibold text-[#3d5f46]/60">
              No matching users found.
            </div>
          ) : state.filteredUsers.length > 0 ? (
            <div className="max-h-32 overflow-y-auto rounded-md border border-[#7f9d86]/20 bg-[#efebe2] p-1">
              {state.filteredUsers.map((user) => {
                const fullName = getParticipantFullName(user.firstName, user.lastName);
                const email = user.email?.trim() || 'No email';
                const isSelected = state.selectedUserId === user.id;

                return (
                  <UserSearchResultItem
                    key={user.id}
                    fullName={fullName}
                    email={email}
                    isSelected={isSelected}
                    onSelect={() => actions.onSelectUser(user.id)}
                  />
                );
              })}
            </div>
          ) : null}

          {state.selectedUser ? (
            <div className="rounded-md border border-[#7f9d86]/20 bg-[#edf3ea] px-3 py-1 text-xs font-semibold text-[#386641]">
              Selected:{' '}
              {getParticipantFullName(state.selectedUser.firstName, state.selectedUser.lastName)} (
              {state.selectedUser.email?.trim() || 'No email'})
            </div>
          ) : null}
        </div>
      )}

      <div className="mt-0.5 flex items-center gap-1.5">
        <Button
          variant="icon-ghost"
          onClick={actions.onSave}
          aria-label="Save new attendee"
          className="h-7 w-7"
          icon={<Icon name="save" className="h-3.5 w-3.5" />}
          disabled={!state.canSave}
        />

        <Button
          variant="icon-close"
          onClick={actions.onCancel}
          aria-label="Cancel adding attendee"
          className="h-7 w-7"
          icon={<Icon name="close" className="h-4 w-4" />}
        />
      </div>
    </div>
  );
};

export default AddAttendeeSection;
