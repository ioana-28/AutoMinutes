import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Popup from '@atoms/Popup/Popup';
import Select from '@atoms/Select/Select';
import { IActionItem, ActionItemStatus } from '@/hooks/useActionItems';
import { IAddActionItemModalProps } from './IAddActionItemModal';
import { getUsers, UserApiResponse } from '@/api/userApi';
import UserSearchResultItem from '@molecules/List Rows/UserSearchResultItem/UserSearchResultItem';
import { getParticipantFullName, getSearchableUserText } from '@/utils/participantUtils';

const AddActionItemModal: FC<IAddActionItemModalProps> = ({
  onSave,
  isSaving = false,
  error,
  triggerVariant = 'nav',
  triggerLabel = 'ADD ACTION ITEM',
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);

  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ActionItemStatus>(ActionItemStatus.OPEN);

  // Assignee state
  const [assigneeUserId, setAssigneeUserId] = useState<number | null>(null);
  const [assigneeName, setAssigneeName] = useState<string | null>(null);
  const [assigneeSearchTerm, setAssigneeSearchTerm] = useState('');
  const [assigneeUsers, setAssigneeUsers] = useState<UserApiResponse[]>([]);
  const [isAssigneeLoading, setIsAssigneeLoading] = useState(false);
  const [assigneeError, setAssigneeError] = useState<string | null>(null);
  const [isAssigneeEditorOpen, setIsAssigneeEditorOpen] = useState(false);
  const hasLoadedUsers = useRef(false);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (!isOpen || assigneeUsers.length > 0 || isAssigneeLoading || hasLoadedUsers.current) {
      return;
    }

    const controller = new AbortController();
    const loadUsers = async () => {
      try {
        setIsAssigneeLoading(true);
        const data = await getUsers(controller.signal);
        setAssigneeUsers(data);
        hasLoadedUsers.current = true;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setAssigneeError('Unable to load users.');
      } finally {
        setIsAssigneeLoading(false);
      }
    };

    loadUsers();
    return () => controller.abort();
  }, [isOpen, assigneeUsers.length, isAssigneeLoading]);

  const filteredUsers = useMemo(() => {
    const query = assigneeSearchTerm.trim().toLowerCase();
    if (!query) return [];
    return assigneeUsers.filter((user) =>
      getSearchableUserText(user.firstName, user.lastName, user.email).includes(query),
    );
  }, [assigneeSearchTerm, assigneeUsers]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setDescription('');
    setDeadline('');
    setStatus(ActionItemStatus.OPEN);
    setAssigneeUserId(null);
    setAssigneeName(null);
    setAssigneeSearchTerm('');
    setIsAssigneeEditorOpen(false);
  };

  const handleConfirm = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (!description.trim()) {
      setIsValidationOpen(true);
      return;
    }
    try {
      const payload: IActionItem = {
        id: 0,
        description,
        assignee: assigneeName,
        assigneeUserId,
        deadline: deadline || null,
        status,
        previousStatus: null,
        assigneeConfidence: 1.0,
        deadlineConfidence: 1.0,
        statusConfidence: 1.0,
      };
      await onSave(payload);
      handleClose();
    } catch {
      // Keep open for error display
    }
  };

  return (
    <>
      <Button
        label={triggerVariant === 'add' ? '+' : triggerLabel}
        variant={triggerVariant}
        onClick={handleOpen}
      />

      <Popup isOpen={isOpen} titleId="add-action-item-popup-title">
        <header className="flex w-full items-center justify-between gap-3 bg-canvas px-4 py-3">
          <h2 id="add-action-item-popup-title" className="m-0 text-lg font-bold text-black">
            NEW ACTION ITEM
          </h2>
          <Button
            variant="icon-close"
            onClick={handleClose}
            aria-label="Close"
            icon={<Icon name="close" className="h-[35px] w-[35px]" />}
          />
        </header>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex flex-col gap-3">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter action item description..."
              className="min-h-[100px] w-full rounded-lg border border-[#7f9d86] bg-[#efebe2] p-3 text-[0.95rem] text-[#1f2937] focus:outline-none focus:ring-2 focus:ring-[#a4c3b2]"
            />

            <Input
              variant="date"
              value={deadline}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value)}
              aria-label="Deadline"
            />

            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as ActionItemStatus)}
              options={[
                { value: ActionItemStatus.OPEN, label: 'Open' },
                { value: ActionItemStatus.IN_PROGRESS, label: 'In Progress' },
                { value: ActionItemStatus.DONE, label: 'Done' },
              ]}
            />

            <div className="flex flex-col gap-2 rounded-lg border border-[#7f9d86]/30 bg-[#efebe2]/50 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#3d5f46]">
                  <Icon name="user" className="h-4 w-4" />
                  <span>Assignee:</span>
                  <span className="font-normal text-[#1f2937]">
                    {assigneeName || 'Unassigned'}
                  </span>
                </div>
                <Button
                  variant="link"
                  label={isAssigneeEditorOpen ? 'Close' : 'Set Assignee'}
                  onClick={() => setIsAssigneeEditorOpen(!isAssigneeEditorOpen)}
                  className="text-xs"
                />
              </div>

              {isAssigneeEditorOpen && (
                <div className="mt-2 flex flex-col gap-2">
                  <Input
                    value={assigneeSearchTerm}
                    onChange={(e) => setAssigneeSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="bg-white"
                  />
                  
                  {isAssigneeLoading && (
                    <div className="text-xs text-[#3d5f46]/70">Loading users...</div>
                  )}
                  {assigneeError && (
                    <div className="text-xs text-danger-text">{assigneeError}</div>
                  )}
                  
                  {filteredUsers.length > 0 && (
                    <div className="max-h-32 overflow-y-auto rounded-md border border-[#7f9d86]/20 bg-white p-1 shadow-inner">
                      {filteredUsers.map((user) => (
                        <UserSearchResultItem
                          key={user.id}
                          fullName={getParticipantFullName(user.firstName, user.lastName)}
                          email={user.email ?? ''}
                          isSelected={assigneeUserId === user.id}
                          onSelect={() => {
                            setAssigneeUserId(user.id);
                            setAssigneeName(getParticipantFullName(user.firstName, user.lastName));
                            setIsAssigneeEditorOpen(false);
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {assigneeSearchTerm && filteredUsers.length === 0 && !isAssigneeLoading && (
                    <div className="text-xs text-[#3d5f46]/70">No users found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-text">
              {error}
            </div>
          )}

          <div className="mt-2 flex items-center justify-start gap-4 pt-2">
            <Button
              label={isSaving ? 'Saving...' : 'SAVE'}
              variant="nav"
              className="min-w-[120px]"
              onClick={handleConfirm}
              disabled={isSaving}
              icon={<Icon name="save" className="h-4 w-4" />}
            />
            <Button
              label="CANCEL"
              variant="nav"
              className="min-w-[120px] bg-white/20 text-black hover:bg-white/30"
              onClick={handleClose}
              icon={<Icon name="close" className="h-4 w-4" />}
            />
          </div>

        </div>
      </Popup>


      <Popup isOpen={isValidationOpen} titleId="action-item-validation-title" variant="confirm">
        <h2 id="action-item-validation-title">Missing details</h2>
        <p>Please add a description for the action item.</p>
        <div data-popup-actions>
          <Button label="OK" variant="nav" onClick={() => setIsValidationOpen(false)} />
        </div>
      </Popup>
    </>
  );
};

export default AddActionItemModal;

