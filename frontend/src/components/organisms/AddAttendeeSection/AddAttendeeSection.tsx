import { ChangeEvent, FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import UserSearchResultItem from '@molecules/UserSearchResultItem/UserSearchResultItem';
import { getParticipantFullName } from '@/utils/participantUtils';
import { IAddAttendeeSectionProps } from './IAddAttendeeSection';

const AddAttendeeSection: FC<IAddAttendeeSectionProps> = ({ state, actions }) => (
  <div className="flex items-start justify-between gap-3 rounded-[20px] border-[2px] border-[#1e3522] bg-[#efebe2] px-4 py-2">
    {state.isLoading ? (
      <span className="mr-3 flex-1 py-1 text-sm font-semibold text-[#1f2937]">Loading users...</span>
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
          className="rounded-full border border-[#7f9d86] bg-[#f8f6f1] px-3 py-1 text-sm font-semibold text-[#1f2937] outline-none focus:border-[#386641]"
          aria-label="Search participant user"
          placeholder="Search by email or name..."
        />

        {state.filteredUsers.length === 0 ? (
          <div className="rounded-full border border-[#c7d4c9] bg-[#f8f6f1] px-3 py-1 text-xs font-semibold text-[#4a5d50]">
            {state.searchTerm.trim()
              ? 'No matching users found.'
              : 'Type to search users by email or name.'}
          </div>
        ) : (
          <div className="max-h-32 overflow-y-auto rounded-[12px] border border-[#7f9d86] bg-[#f8f6f1] p-1">
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
        )}

        {state.selectedUser ? (
          <div className="rounded-full border border-[#7f9d86] bg-[#edf3ea] px-3 py-1 text-xs font-semibold text-[#1f2937]">
            Selected: {getParticipantFullName(state.selectedUser.firstName, state.selectedUser.lastName)}
            ({state.selectedUser.email?.trim() || 'No email'})
          </div>
        ) : null}
      </div>
    )}

    <div className="mt-1 flex items-center gap-2">
      <Button
        variant="icon-ghost"
        onClick={actions.onSave}
        aria-label="Save new attendee"
        className="h-7 w-7 border border-[#8aa08d]"
        icon={<Icon name="save" className="h-3.5 w-3.5" />}
        disabled={!state.canSave}
      />

      <Button
        variant="icon-close"
        onClick={actions.onCancel}
        aria-label="Cancel adding attendee"
        className="h-7 w-7 border-none bg-transparent text-[#d88f8f] shadow-none"
        icon={<Icon name="close" className="h-4 w-4" />}
      />
    </div>
  </div>
);

export default AddAttendeeSection;
