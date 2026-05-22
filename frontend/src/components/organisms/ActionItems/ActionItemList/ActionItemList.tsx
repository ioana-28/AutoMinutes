import { FC, useEffect, useMemo, useRef, useState } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Select from '@atoms/Select/Select';
import GenericList from '@molecules/GenericList/GenericList';
import { IActionItemListProps } from './IActionItemList';
import { IActionItem, ActionItemStatus } from '@/hooks/useActionItems';
import { getUsers, UserApiResponse } from '@/api/userApi';
import UserSearchResultItem from '@molecules/List Rows/UserSearchResultItem/UserSearchResultItem';
import { getParticipantFullName, getSearchableUserText } from '@/utils/participantUtils';

const CONFIDENCE_THRESHOLD = 0.7;

const getNormalizedActionItemStatus = (status: string) =>
  status
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toUpperCase();

const getActionItemStatusPillClasses = (status: string) => {
  const normalizedStatus = getNormalizedActionItemStatus(status);

  if (normalizedStatus === 'PENDING' || normalizedStatus === 'OPEN') {
    return 'bg-[#F2E7D7] border-[#D5BE98]';
  }

  if (normalizedStatus === 'IN PROGRESS') {
    return 'bg-[#E3EAF3] border-[#A8B9CF]';
  }

  if (normalizedStatus === 'DONE') {
    return 'bg-[#E4EFE5] border-[#AFC8B3]';
  }

  return 'bg-[#efebe2] border-[#7f9d86]/30';
};

const ActionItemList: FC<IActionItemListProps> = ({
  variant = 'default',
  items,
  isLoading,
  error,
  addControls,
  expandedId,
  onToggleExpand,
  editingItem,
  onEditingItemChange,
  onSave,
  onSaveItem,
  onCancelEdit,
  onRequestDelete,
  savingId: _savingId,
}) => {
  const isPanel = variant === 'panel';
  const [assigneeEditId, setAssigneeEditId] = useState<number | null>(null);
  const [assigneeSearchTerm, setAssigneeSearchTerm] = useState('');
  const [assigneeUsers, setAssigneeUsers] = useState<UserApiResponse[]>([]);
  const [isAssigneeLoading, setIsAssigneeLoading] = useState(false);
  const [assigneeError, setAssigneeError] = useState<string | null>(null);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<number | null>(null);
  const hasLoadedAssigneeUsers = useRef(false);

  // State for Add Row assignee
  const [isAssigneeAddingOpen, setIsAssigneeAddingOpen] = useState(false);
  const [assigneeSearchTermAdd, setAssigneeSearchTermAdd] = useState('');

  const statusOptions = [
    { value: ActionItemStatus.OPEN, label: 'Open' },
    { value: ActionItemStatus.IN_PROGRESS, label: 'In Progress' },
    { value: ActionItemStatus.DONE, label: 'Done' },
  ];

  const getStatusLabel = (status: ActionItemStatus) => {
    const option = statusOptions.find((o) => o.value === status);
    return option ? option.label : status;
  };

  const hasLowConfidence = (item: IActionItem) => {
    return (
      (item.assigneeConfidence !== null && item.assigneeConfidence !== undefined && item.assigneeConfidence < CONFIDENCE_THRESHOLD) ||
      (item.deadlineConfidence !== null && item.deadlineConfidence !== undefined && item.deadlineConfidence < CONFIDENCE_THRESHOLD) ||
      (item.statusConfidence !== null && item.statusConfidence !== undefined && item.statusConfidence < CONFIDENCE_THRESHOLD)
    );
  };

  const handleConfirmActionItem = (item: IActionItem) => {
    onSaveItem({
      ...item,
      assigneeConfidence: 1.0,
      deadlineConfidence: 1.0,
      statusConfidence: 1.0,
    });
  };

  useEffect(() => {
    if (
      (assigneeEditId === null && !addControls.isAdding) ||
      assigneeUsers.length > 0 ||
      isAssigneeLoading ||
      hasLoadedAssigneeUsers.current
    ) {
      return;
    }

    const controller = new AbortController();

    const loadUsers = async () => {
      try {
        setIsAssigneeLoading(true);
        setAssigneeError(null);
        const data = await getUsers(controller.signal);
        setAssigneeUsers(data);
        hasLoadedAssigneeUsers.current = true;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setAssigneeError('Unable to load users.');
      } finally {
        setIsAssigneeLoading(false);
      }
    };

    loadUsers();

    return () => controller.abort();
  }, [assigneeEditId, assigneeUsers.length, addControls.isAdding]);

  const filteredAssigneeUsers = useMemo(() => {
    const query = assigneeSearchTerm.trim().toLowerCase();
    if (!query) {
      return [];
    }

    return assigneeUsers.filter((user) =>
      getSearchableUserText(user.firstName, user.lastName, user.email).includes(query),
    );
  }, [assigneeSearchTerm, assigneeUsers]);

  const filteredAssigneeUsersAdd = useMemo(() => {
    const query = assigneeSearchTermAdd.trim().toLowerCase();
    if (!query) {
      return [];
    }

    return assigneeUsers.filter((user) =>
      getSearchableUserText(user.firstName, user.lastName, user.email).includes(query),
    );
  }, [assigneeSearchTermAdd, assigneeUsers]);

  const selectedAssignee = useMemo(() => {
    if (selectedAssigneeId === null) {
      return null;
    }
    return assigneeUsers.find((user) => user.id === selectedAssigneeId) ?? null;
  }, [assigneeUsers, selectedAssigneeId]);

  const selectedAssigneeAdd = useMemo(() => {
    const { addItem } = addControls;
    if (!addItem || addItem.assigneeUserId === null) {
      return null;
    }
    return assigneeUsers.find((user) => user.id === addItem.assigneeUserId) ?? null;
  }, [assigneeUsers, addControls.addItem]);

  const handleOpenAssigneeEditor = (item: IActionItem) => {
    setAssigneeEditId(item.id);
    setAssigneeSearchTerm('');
    setAssigneeError(null);
    setSelectedAssigneeId(item.assigneeUserId ?? null);
  };

  const handleCancelAssigneeEditor = () => {
    setAssigneeEditId(null);
    setAssigneeSearchTerm('');
    setAssigneeError(null);
    setSelectedAssigneeId(null);
  };

  const handleSaveAssignee = async (item: IActionItem) => {
    try {
      setAssigneeError(null);
      const assigneeName = selectedAssignee
        ? getParticipantFullName(selectedAssignee.firstName, selectedAssignee.lastName)
        : null;
      await onSaveItem({
        ...item,
        assignee: assigneeName,
        assigneeUserId: selectedAssignee?.id ?? null,
        assigneeConfidence: 1.0, // Clear low confidence on update
      });
      handleCancelAssigneeEditor();
    } catch {
      setAssigneeError('Unable to update assignee.');
    }
  };

  const renderAddRow = () => {
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
            />            <Select
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


  if (isLoading) {
    return (
      <div
        className={`rounded-lg border border-dashed border-[#7f9d86]/40 bg-[#efebe2] text-center text-[#1f2937]/60 ${isPanel ? 'p-4 text-xs' : 'p-8'}`}
      >
        Loading action items...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="rounded-lg border border-[#b33a3a]/30 bg-[#f4c7c7]/30 p-3 text-center text-xs text-[#6b1f1f]">
          {error}
        </div>
      )}
      {renderAddRow()}
      <GenericList<IActionItem>
        items={items}
        variant={variant}
        getItemId={(item) => item.id}
        expandedId={expandedId}
        onToggleExpand={(id) => onToggleExpand(id as number)}
        onItemClick={(id) => {
          if (editingItem?.id !== id) {
            onToggleExpand(id as number);
          }
        }}
        emptyMessage="No action items found."
        renderExpanded={(item) => {
          const lowConfidence = hasLowConfidence(item);
          return (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#3d5f46]/50">
                Full Description
              </span>
              <p className="whitespace-pre-line leading-relaxed text-[#1f2937]">{item.description}</p>

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

              <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-[#3d5f46]/70">
                <div className="flex items-center gap-2">
                  <span>Assignee</span>
                  <span className="text-[#1f2937]">{item.assignee?.trim() || 'Unassigned'}</span>
                </div>
                <Button
                  variant="icon-ghost"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenAssigneeEditor(item);
                  }}
                  aria-label="Edit assignee"
                  className={isPanel ? 'h-6 w-6' : 'h-7 w-7'}
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

                  <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-[#3d5f46]/70">
                    <span>Selected</span>
                    <span className="text-[#1f2937]">
                      {selectedAssignee
                        ? getParticipantFullName(selectedAssignee.firstName, selectedAssignee.lastName)
                        : 'Unassigned'}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="icon-ghost"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSaveAssignee(item);
                      }}
                      aria-label="Save assignee"
                      className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
                      icon={<Icon name="save" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
                    />
                    <Button
                      variant="icon-close"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCancelAssigneeEditor();
                      }}
                      aria-label="Cancel assignee edit"
                      className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
                      icon={<Icon name="close" className={isPanel ? 'h-4 w-4' : 'h-4 w-4'} />}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          );
        }}
        renderLeft={(item) => {
          const isEditing = !!editingItem && editingItem.id === item.id;
          const isDone = item.status === ActionItemStatus.DONE;

          if (isEditing && editingItem) {
            return (
              <div className={`flex flex-1 ${isPanel ? 'flex-col gap-2' : 'items-center gap-4'}`}>
                <Input
                  variant={isPanel ? 'compact' : 'text'}
                  value={editingItem.description ?? ''}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    onEditingItemChange({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description"
                  className={isPanel ? '' : 'flex-1'}
                />
                <Input
                  variant={isPanel ? 'compact' : 'date'}
                  type="date"
                  value={editingItem.deadline ?? ''}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    onEditingItemChange({
                      ...editingItem,
                      deadline: e.target.value,
                    })
                  }
                  className={isPanel ? '' : 'w-[200px]'}
                />
              </div>
            );
          }

          return (
            <div className={`flex flex-1 ${isPanel ? 'gap-2' : 'items-center gap-4'}`}>
              <div className="relative flex items-center">
                <Button
                  variant="icon-ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    let nextStatus: ActionItemStatus;
                    let nextPreviousStatus: ActionItemStatus | null | undefined = item.previousStatus;

                    if (isDone) {
                      // Revert to previous status or 'Open'
                      nextStatus = item.previousStatus || ActionItemStatus.OPEN;
                    } else {
                      // Mark as Done and save current status as previous
                      nextStatus = ActionItemStatus.DONE;
                      nextPreviousStatus = item.status;
                    }

                    onSaveItem({
                      ...item,
                      status: nextStatus,
                      previousStatus: nextPreviousStatus,
                    });
                  }}
                  aria-label={isDone ? 'Mark as open' : 'Mark as done'}
                  className={`h-8 w-8 transition-colors ${isDone ? 'text-green-600' : 'text-[#d4ccbc] hover:text-[#386641]'}`}
                  icon={<Icon name="check" className="h-5 w-5" />}
                />
              </div>
              <div className={`flex flex-1 ${isPanel ? 'flex-col gap-1' : 'items-center gap-4'}`}>
                <p className={`text-[#1f2937] ${isPanel ? 'text-[11px]' : 'text-sm'}`}>
                  {item.description.length > 50
                    ? `${item.description.slice(0, 50)}...`
                    : item.description}
                </p>
                <span className={`text-[#3d5f46]/70 ${isPanel ? 'text-[10px]' : 'text-xs'}`}>
                  {item.deadline || 'No deadline'}
                </span>
              </div>
            </div>
          );
        }}
        renderRight={(item) => {
          const isEditing = !!editingItem && editingItem.id === item.id;
          const lowConfidence = hasLowConfidence(item);

          if (isEditing && editingItem) {
            return (
              <div className={`flex items-center ${isPanel ? 'gap-2' : 'gap-4'}`}>
                <Select
                  variant={isPanel ? 'compact' : 'default'}
                  className={isPanel ? 'w-[100px]' : 'w-[150px] mr-4'}
                  value={editingItem.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    const newStatus = e.target.value as ActionItemStatus;
                    onEditingItemChange({
                      ...editingItem,
                      status: newStatus,
                      previousStatus: newStatus,
                    });
                  }}
                  options={statusOptions}

                />
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="icon-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestDelete(item.id);
                    }}
                    aria-label="Delete action item"
                    className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
                    icon={<Icon name="trash" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
                  />
                  <Button
                    variant="icon-ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSave();
                    }}
                    aria-label="Save changes"
                    className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
                    icon={<Icon name="save" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
                  />
                  <Button
                    variant="icon-ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancelEdit();
                    }}
                    aria-label="Cancel editing"
                    className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
                    icon={<Icon name="close" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
                  />
                </div>
              </div>
            );
          }

          return (
            <div className={`flex items-center ${isPanel ? 'gap-2' : 'gap-3'}`}>
              <div className="relative flex items-center gap-2">
                <span
                  className={`rounded-full border font-bold uppercase tracking-[0.1em] text-[#2F3A3A] ${getActionItemStatusPillClasses(item.status)} ${isPanel ? 'px-1.5 py-0 text-[9.5px]' : 'px-2 py-0.5 text-[10px]'}`}
                >
                  {getStatusLabel(item.status)}
                </span>
                {lowConfidence && (
                  <Icon name="alert" className="h-3.5 w-3.5 text-amber-500" />
                )}
              </div>
              <Button
                variant="icon-ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditingItemChange({
                    ...item,
                    assignee: item.assignee ?? null,
                  });
                }}
                aria-label="Edit action item"
                className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
                icon={<Icon name="edit" className={isPanel ? 'h-4 w-4' : 'h-5 w-5'} />}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default ActionItemList;
