import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import UserSearchResultItem from '@molecules/List Rows/UserSearchResultItem/UserSearchResultItem';
import { getParticipantFullName } from '@/utils/participantUtils';
import { ActionItemExpandedContentProps } from './IActionItemExpandedContent';

const ActionItemExpandedContent: FC<ActionItemExpandedContentProps> = ({
  item,
  isPanel,
  lowConfidence,
  handleConfirmActionItem,
  assigneeEditId,
  handleOpenAssigneeEditor,
  handleCancelAssigneeEditor,
  handleSaveAssignee,
  assigneeSearchTerm,
  setAssigneeSearchTerm,
  isAssigneeLoading,
  assigneeError,
  filteredAssigneeUsers,
  selectedAssigneeId,
  setSelectedAssigneeId,
  selectedAssignee,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[#3d5f46]/50">
        Full Description
      </span>
      <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-[#1f2937]">{item.description}</p>

      {lowConfidence && (
        <div className="mt-2 flex justify-start">
          <Button
            variant="generate-summary"
            onClick={(event) => {
              event.stopPropagation();
              handleConfirmActionItem(item);
            }}
            label="Mark as OK"
            className="!h-6 !bg-amber-500 !border-amber-500 hover:!bg-amber-600 px-2 text-[9px] uppercase tracking-wider"
            icon={<Icon name="check" className="h-3 w-3" />}
          />
        </div>
      )}

      <div className="mt-2 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-[#3d5f46]/70">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span>Assignee</span>
          <span className="text-[#1f2937] text-xs sm:text-sm">{item.assignee?.trim() || 'Unassigned'}</span>
        </div>
        <Button
          variant="icon-ghost"
          onClick={(event) => {
            event.stopPropagation();
            handleOpenAssigneeEditor(item);
          }}
          aria-label="Edit assignee"
          className={isPanel ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-6 w-6 sm:h-7 sm:w-7'}
          icon={<Icon name="edit" className={isPanel ? 'h-3 w-3' : 'h-3.5 w-3.5'} />}
        />
      </div>

      {assigneeEditId === item.id ? (
        <div
          className="mt-2 rounded-lg border border-[#7f9d86]/30 bg-[#efebe2] p-2"
          onClick={(event) => event.stopPropagation()}
        >
          <Input
            variant={isPanel ? 'compact' : 'text'}
            value={assigneeSearchTerm}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setAssigneeSearchTerm(event.target.value)}
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
          ) : assigneeSearchTerm.trim() && filteredAssigneeUsers.length === 0 ? (
            <div className="mt-2 text-[11px] font-semibold text-[#3d5f46]/70">
              No matching users found.
            </div>
          ) : filteredAssigneeUsers.length > 0 ? (
            <div className="mt-2 max-h-32 overflow-y-auto rounded-md border border-[#7f9d86]/20 bg-[#f8f6f1] p-1">
              {filteredAssigneeUsers.map((user) => {
                const fullName = getParticipantFullName(user.firstName, user.lastName);
                const email = user.email?.trim() || 'No email';
                const isSelected = selectedAssigneeId === user.id;

                return (
                  <UserSearchResultItem
                    key={user.id}
                    fullName={fullName}
                    email={email}
                    isSelected={isSelected}
                    onSelect={() => setSelectedAssigneeId(user.id)}
                  />
                );
              })}
            </div>
          ) : null}

          <div className="mt-2 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-[#3d5f46]/70">
            <span>Selected</span>
            <span className="text-[#1f2937]">
              {selectedAssignee
                ? getParticipantFullName(selectedAssignee.firstName, selectedAssignee.lastName)
                : 'Unassigned'}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="icon-ghost"
              onClick={(event) => {
                event.stopPropagation();
                handleSaveAssignee(item);
              }}
              aria-label="Save assignee"
              className={isPanel ? 'h-6 w-6 sm:h-7 sm:w-7' : 'h-7 w-7 sm:h-8 sm:w-8'}
              icon={<Icon name="save" className={isPanel ? 'h-3 w-3 sm:h-3.5 sm:w-3.5' : 'h-3.5 w-3.5 sm:h-4 sm:w-4'} />}
            />
            <Button
              variant="icon-close"
              onClick={(event) => {
                event.stopPropagation();
                handleCancelAssigneeEditor();
              }}
              aria-label="Cancel assignee edit"
              className={isPanel ? 'h-6 w-6 sm:h-7 sm:w-7' : 'h-7 w-7 sm:h-8 sm:w-8'}
              icon={<Icon name="close" className={isPanel ? 'h-3 w-3' : 'h-4 w-4'} />}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ActionItemExpandedContent;