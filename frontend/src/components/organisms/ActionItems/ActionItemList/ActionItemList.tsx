import { FC, useEffect, useMemo, useRef, useState } from 'react';
import GenericList from '@molecules/GenericList/GenericList';
import { IActionItemListProps } from './IActionItemList';
import { IActionItem, ActionItemStatus } from '@/hooks/useActionItems';
import { getUsers, UserApiResponse } from '@/api/userApi';
import { getParticipantFullName, getSearchableUserText } from '@/utils/participantUtils';


import ActionItemAddRow from '@molecules/ActionItemListElements/ActionItemAddRow/ActionItemAddRow';
import ActionItemExpandedContent from '@molecules/ActionItemListElements/ActionItemExpandedContent/ActionItemExpandedContent';
import ActionItemRowLeft from '@molecules/ActionItemListElements/ActionItemRowLeft/ActionItemRowLeft';
import ActionItemRowRight from '@molecules/ActionItemListElements/ActionItemRowRight/ActionItemRowRight';

const CONFIDENCE_THRESHOLD = 0.7;

const getNormalizedActionItemStatus = (status: string) =>
  status.trim().toUpperCase();

const getActionItemStatusPillClasses = (status: string) => {
  const normalizedStatus = getNormalizedActionItemStatus(status);

  if (normalizedStatus === 'PENDING' || normalizedStatus === 'OPEN') {
    return 'bg-[#F2E7D7] border-[#D5BE98]';
  }
  if (normalizedStatus === 'IN_PROGRESS') {
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

  const [isAssigneeAddingOpen, setIsAssigneeAddingOpen] = useState(false);
  const [assigneeSearchTermAdd, setAssigneeSearchTermAdd] = useState('');

  const statusOptions = [
    { value: 'OPEN' as ActionItemStatus, label: 'Open' },
    { value: 'IN_PROGRESS' as ActionItemStatus, label: 'In Progress' },
    { value: 'DONE' as ActionItemStatus, label: 'Done' },
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
      } 
      finally {
        setIsAssigneeLoading(false);
      }
    };

    loadUsers();

    return () => controller.abort();
  }, [assigneeEditId, assigneeUsers.length, addControls.isAdding, isAssigneeLoading]);

  const filteredAssigneeUsers = useMemo(() => {
    const query = assigneeSearchTerm.trim().toLowerCase();
    if (!query) return [];

    return assigneeUsers.filter((user) =>
      getSearchableUserText(user.firstName, user.lastName, user.email).includes(query),
    );
  }, [assigneeSearchTerm, assigneeUsers]);

  const filteredAssigneeUsersAdd = useMemo(() => {
    const query = assigneeSearchTermAdd.trim().toLowerCase();
    if (!query) return [];

    return assigneeUsers.filter((user) =>
      getSearchableUserText(user.firstName, user.lastName, user.email).includes(query),
    );
  }, [assigneeSearchTermAdd, assigneeUsers]);

  const selectedAssignee = useMemo(() => {
    if (selectedAssigneeId === null) return null;
    return assigneeUsers.find((user) => user.id === selectedAssigneeId) ?? null;
  }, [assigneeUsers, selectedAssigneeId]);

  const selectedAssigneeAdd = useMemo(() => {
    const { addItem } = addControls;
    if (!addItem || addItem.assigneeUserId === null) return null;
    return assigneeUsers.find((user) => user.id === addItem.assigneeUserId) ?? null;
  }, [assigneeUsers, addControls]);

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
        assigneeConfidence: 1.0,
      });
      handleCancelAssigneeEditor();
    } catch {
      setAssigneeError('Unable to update assignee.');
    }
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
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {error && (
        <div className="rounded-lg border border-[#b33a3a]/30 bg-[#f4c7c7]/30 p-2 sm:p-3 text-center text-[10px] sm:text-xs text-[#6b1f1f]">
          {error}
        </div>
      )}
      <ActionItemAddRow
        isPanel={isPanel}
        addControls={addControls}
        assigneeSearchTermAdd={assigneeSearchTermAdd}
        setAssigneeSearchTermAdd={setAssigneeSearchTermAdd}
        isAssigneeLoading={isAssigneeLoading}
        assigneeError={assigneeError}
        filteredAssigneeUsersAdd={filteredAssigneeUsersAdd}
        isAssigneeAddingOpen={isAssigneeAddingOpen}
        setIsAssigneeAddingOpen={setIsAssigneeAddingOpen}
        selectedAssigneeAdd={selectedAssigneeAdd}
        statusOptions={statusOptions}
      />
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
        renderExpanded={(item) => (
          <ActionItemExpandedContent
            item={item}
            isPanel={isPanel}
            lowConfidence={hasLowConfidence(item)}
            handleConfirmActionItem={handleConfirmActionItem}
            assigneeEditId={assigneeEditId}
            handleOpenAssigneeEditor={handleOpenAssigneeEditor}
            handleCancelAssigneeEditor={handleCancelAssigneeEditor}
            handleSaveAssignee={handleSaveAssignee}
            assigneeSearchTerm={assigneeSearchTerm}
            setAssigneeSearchTerm={setAssigneeSearchTerm}
            isAssigneeLoading={isAssigneeLoading}
            assigneeError={assigneeError}
            filteredAssigneeUsers={filteredAssigneeUsers}
            selectedAssigneeId={selectedAssigneeId}
            setSelectedAssigneeId={setSelectedAssigneeId}
            selectedAssignee={selectedAssignee}
          />
        )}
        renderLeft={(item) => (
          <ActionItemRowLeft
            item={item}
            isPanel={isPanel}
            editingItem={editingItem}
            onEditingItemChange={onEditingItemChange}
            onSaveItem={onSaveItem}
          />
        )}
        renderRight={(item) => (
          <ActionItemRowRight
            item={item}
            isPanel={isPanel}
            editingItem={editingItem}
            onEditingItemChange={onEditingItemChange}
            onRequestDelete={onRequestDelete}
            onSave={onSave}
            onCancelEdit={onCancelEdit}
            lowConfidence={hasLowConfidence(item)}
            statusOptions={statusOptions}
            getStatusLabel={getStatusLabel}
            getActionItemStatusPillClasses={getActionItemStatusPillClasses}
          />
        )}
      />
    </div>
  );
};

export default ActionItemList;