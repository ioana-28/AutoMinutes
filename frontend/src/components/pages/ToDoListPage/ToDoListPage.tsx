import { FC } from 'react';
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

const ToDoListPage: FC = () => {
  const navigate = useNavigate();
  const storedUserId = Number(localStorage.getItem('userId'));
  const activeUserId = Number.isFinite(storedUserId) && storedUserId > 0 ? storedUserId : null;
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

  const { isCreatingMeeting, createMeetingError, handleCreateMeeting, clearCreateMeetingError } = useMeetings(activeUserId);

  const { filteredItems, toolbarProps, addControls, listProps, deleteDialogProps } =
    useActionItemListLogic({
      items,
      onDelete: handleDeleteActionItem,
      onSave: async (payload) => {
        await handleSaveActionItem(payload);
      },
      deletingId,
      savingId,
    });

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
      contentClassName="p-4 max-w-none"
    >
      <ActionItemList
        items={filteredItems}
        isLoading={isLoading}
        error={error}
        addControls={addControls}
        expandedId={listProps.expandedId}
        onToggleExpand={listProps.onToggleExpand}
        editingItem={listProps.editingItem}
        onEditingItemChange={listProps.setEditingItem}
        onSave={listProps.onSave}
        onCancelEdit={listProps.onCancelEdit}
        onRequestDelete={listProps.onRequestDelete}
        savingId={savingId}
      />
    </ToDoListTemplate>
  );
};

export default ToDoListPage;
