import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToDoListTemplate from '@templates/ToDoListTemplate/ToDoListTemplate';
import AddMeetingModal from '@organisms/Meeting/AddMeetingModal/AddMeetingModal';
import MeetingNavbar from '@organisms/Meeting/MeetingNavbar/MeetingNavbar';
import ActionItemList from '@organisms/ActionItems/ActionItemList/ActionItemList';
import ActionItemListToolbar from '@organisms/ActionItems/ActionItemListToolbar/ActionItemListToolbar';
import { ActionItemConfirmationDialog } from '@molecules/ConfirmationDialog/ConfirmationDialog';
import { useActionItems } from '@/hooks/useActionItems';
import { useMeetings } from '@/hooks/useMeetings';
import useActionItemListLogic from '@/hooks/useActionItemListLogic';
import { getUserById, UserApiResponse } from '@/api/userApi';
import { getParticipantFullName } from '@/utils/participantUtils';

const ToDoListPage: FC = () => {
  const navigate = useNavigate();
  const storedUserId = Number(localStorage.getItem('userId'));
  const activeUserId = Number.isFinite(storedUserId) && storedUserId > 0 ? storedUserId : null;
  const [currentUser, setCurrentUser] = useState<UserApiResponse | null>(null);

  useEffect(() => {
    if (activeUserId) {
      getUserById(activeUserId).then(setCurrentUser).catch(console.error);
    }
  }, [activeUserId]);

  const currentUserName = useMemo(() => {
    if (!currentUser) return null;
    return getParticipantFullName(currentUser.firstName, currentUser.lastName).toLowerCase();
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    window.dispatchEvent(new Event('auth:changed'));
    navigate('/auth', { replace: true });
  };
  const {
    items,
    isLoading,
    error,
    deletingId,
    savingId,
    handleSaveActionItem,
    handleDeleteActionItem,
  } = useActionItems();

  const userFilteredItems = useMemo(() => {
    if (!activeUserId) return items;
    return items.filter((item) => {
      // Direct ID match
      if (item.assigneeUserId === activeUserId) return true;

      // Name match for AI assigned items without ID
      if (!item.assigneeUserId && item.assignee && currentUserName) {
        return item.assignee.toLowerCase().includes(currentUserName) ||
               currentUserName.includes(item.assignee.toLowerCase());
      }

      return false;
    });
  }, [items, activeUserId, currentUserName]);

  const { isCreatingMeeting, createMeetingError, handleCreateMeeting, clearCreateMeetingError } = useMeetings(activeUserId);

  const { filteredItems, toolbarProps, addControls, listProps, deleteDialogProps } =
    useActionItemListLogic({
      items: userFilteredItems,
      onDelete: handleDeleteActionItem,
      onSave: async (payload) => {
        await handleSaveActionItem(payload);
      },
      deletingId,
      savingId,
    });

  const actionItemListAddControls = addControls as unknown as import('@organisms/ActionItems/ActionItemList/IActionItemList').IActionItemListProps['addControls'];

  return (
    <ToDoListTemplate
      navbarSlot={
        <MeetingNavbar
          activePage="to-do-list"
          onNavigateMeetingList={() => navigate('/meeting-list')}
          onNavigateToDoList={() => navigate('/to-do-list')}
          onLogout={handleLogout}
          addMeetingSlot={
            <AddMeetingModal
              onCreateMeeting={handleCreateMeeting}
              isCreatingMeeting={isCreatingMeeting}
              createMeetingError={createMeetingError}
              onClearError={clearCreateMeetingError}
            />
          }
        />
      }
      toolbarSlot={<ActionItemListToolbar {...toolbarProps} />}
      modalSlot={<ActionItemConfirmationDialog {...deleteDialogProps} />}
      contentClassName="px-4 py-3 sm:p-4 max-w-none"
    >
      <ActionItemList
        items={filteredItems}
        isLoading={isLoading}
        error={error}
        addControls={actionItemListAddControls}
        expandedId={listProps.expandedId}
        onToggleExpand={listProps.onToggleExpand}
        editingItem={listProps.editingItem}
        onEditingItemChange={listProps.setEditingItem}
        onSave={listProps.onSave}
        onSaveItem={listProps.onSaveItem}
        onCancelEdit={listProps.onCancelEdit}
        onRequestDelete={listProps.onRequestDelete}
        savingId={savingId}
      />
    </ToDoListTemplate>
  );
};

export default ToDoListPage;
