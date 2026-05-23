import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Select from '@atoms/Select/Select';
import UserSearchResultItem from '@molecules/List Rows/UserSearchResultItem/UserSearchResultItem';
import { getParticipantFullName } from '@/utils/participantUtils';
import { ActionItemStatus } from '@/hooks/useActionItems';
import { ActionItemAddRowProps } from './IActionItemAddRow';

const ActionItemAddRow: FC<ActionItemAddRowProps> = ({
  isPanel,
  addControls,
  assigneeSearchTermAdd,
  setAssigneeSearchTermAdd,
  isAssigneeLoading,
  assigneeError,
  filteredAssigneeUsersAdd,
  isAssigneeAddingOpen,
  setIsAssigneeAddingOpen,
  selectedAssigneeAdd,
  statusOptions,
}) => {
  const { addItem } = addControls;
  if (!addControls.isAdding || !addItem) return null;

  return (
    <div
      className={`w-full rounded-xl border border-[#7f9d86]/30 bg-[#efebe2] px-3 py-2.5 shadow-sm ${isPanel ? 'mb-2' : 'mb-3'}`}
    >
      <div className={`flex flex-col gap-2.5 ${isPanel ? '' : 'lg:flex-row lg:items-start'}`}>
        <textarea
          value={addItem.description ?? ''}
          onChange={(event) =>
            addControls.onAddItemChange({
              ...addItem,
              description: event.target.value,
            })
          }
          placeholder="Enter action item description..."
          className={`min-h-[68px] w-full rounded-md border border-[#7f9d86]/20 bg-[#f8f4ec] p-2.5 text-[0.88rem] text-[#1f2937] placeholder:text-[#3d5f46]/40 focus:outline-none focus:ring-1 focus:ring-[#7f9d86] ${isPanel ? '' : 'lg:flex-1'}`}
        />

        <div className={`flex items-col gap-2 ${isPanel ? '' : 'min-w-[140px] lg:max-w-[150px]'}`}>
          <Input
            variant={isPanel ? 'compact' : 'date'}
            type="date"
            value={addItem.deadline ?? ''}
            onChange={(event) =>
              addControls.onAddItemChange({
                ...addItem,
                deadline: event.target.value,
              })
            }
          />
          <Select
            variant={isPanel ? 'compact' : 'default'}
            value={addItem.status}
            onChange={(event) => {
              const newStatus = event.target.value as ActionItemStatus;
              addControls.onAddItemChange({
                ...addItem,
                status: newStatus,
                previousStatus: newStatus,
              });
            }}
            options={statusOptions}
          />
        </div>
      </div>

      <div className="mt-2.5 flex flex-col gap-2 border-t border-[#7f9d86]/10 pt-2.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#3d5f46]/70">
          <div className="flex items-center gap-2">
            <span>Assignee</span>
            <span className="text-[#1f2937]">
              {selectedAssigneeAdd
                ? getParticipantFullName(selectedAssigneeAdd.firstName, selectedAssigneeAdd.lastName)
                : 'Unassigned'}
            </span>
          </div>
          <Button
            variant="icon-ghost"
            onClick={() => setIsAssigneeAddingOpen(!isAssigneeAddingOpen)}
            aria-label="Set assignee"
            className={isPanel ? 'h-6 w-6' : 'h-7 w-7'}
            icon={<Icon name="user" className={isPanel ? 'h-3 w-3' : 'h-3.5 w-3.5'} />}
          />
        </div>

        {isAssigneeAddingOpen ? (
          <div className="rounded-lg border border-[#7f9d86]/30 bg-[#efebe2] p-2">
            <Input
              variant={isPanel ? 'compact' : 'text'}
              value={assigneeSearchTermAdd}
              onChange={(event) => setAssigneeSearchTermAdd(event.target.value)}
              placeholder="Search by name or email..."
            />

            {isAssigneeLoading ? (
              <div className="mt-2 text-[11px] font-semibold text-[#3d5f46]/70">
                Loading users...
              </div>
            ) : assigneeError ? (
              <div className="mt-2 text-[11px] font-semibold text-[#a94442]">
                {assigneeError}
              </div>
            ) : assigneeSearchTermAdd.trim() && filteredAssigneeUsersAdd.length === 0 ? (
              <div className="mt-2 text-[11px] font-semibold text-[#3d5f46]/70">
                No matching users found.
              </div>
            ) : filteredAssigneeUsersAdd.length > 0 ? (
              <div className="mt-2 max-h-32 overflow-y-auto rounded-md border border-[#7f9d86]/20 bg-[#f8f6f1] p-1">
                {filteredAssigneeUsersAdd.map((user) => {
                  const fullName = getParticipantFullName(user.firstName, user.lastName);
                  const email = user.email?.trim() || 'No email';
                  const isSelected = addItem.assigneeUserId === user.id;

                  return (
                    <UserSearchResultItem
                      key={user.id}
                      fullName={fullName}
                      email={email}
                      isSelected={isSelected}
                      onSelect={() => {
                        addControls.onAddItemChange({
                          ...addItem,
                          assigneeUserId: user.id,
                          assignee: fullName,
                        });
                        setIsAssigneeAddingOpen(false);
                        setAssigneeSearchTermAdd('');
                      }}
                    />
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-start gap-3 border-t border-[#7f9d86]/10 pt-3">
        <Button
          variant="icon-ghost"
          onClick={addControls.onSaveAdd}
          aria-label="Save new action item"
          className={isPanel ? 'h-8 w-8' : 'h-9 w-9'}
          disabled={addControls.isSaving}
          icon={<Icon name="save" className="h-4 w-4" />}
        />
        <Button
          variant="icon-close"
          onClick={() => {
            addControls.onCancelAdd();
            setIsAssigneeAddingOpen(false);
            setAssigneeSearchTermAdd('');
          }}
          aria-label="Cancel adding action item"
          className={isPanel ? 'h-8 w-8' : 'h-9 w-9'}
          icon={<Icon name="close" className="h-4 w-4" />}
        />
      </div>

      {addControls.addError ? (
        <p className="mt-2 text-[11px] font-medium text-[#a94442]">{addControls.addError}</p>
      ) : null}
    </div>
  );
};

export default ActionItemAddRow;