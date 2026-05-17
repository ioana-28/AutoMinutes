import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import ToDoListTemplate from '@templates/ToDoListTemplate/ToDoListTemplate';
import AddMeetingModal from '@organisms/Meeting/AddMeetingModal/AddMeetingModal';
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

  const { isCreatingMeeting, createMeetingError, handleCreateMeeting } = useMeetings(activeUserId);

  const { filteredItems, toolbarProps, addControls, listProps, deleteDialogProps } =
    useActionItemListLogic({
      items,
      onDelete: handleDeleteActionItem,
      onSave: handleSaveActionItem,
      deletingId,
      savingId,
    });

  return (
    <ToDoListTemplate
      activePage="to-do-list"
      items={filteredItems}
      isLoading={isLoading}
      error={error}
      deletingId={deletingId}
      savingId={savingId}
      onLogout={handleLogout}
      addMeetingSlot={
        <AddMeetingModal
          onCreateMeeting={handleCreateMeeting}
          isCreatingMeeting={isCreatingMeeting}
          createMeetingError={createMeetingError}
        />
      }
      toolbarProps={toolbarProps}
      addControls={addControls}
      listProps={listProps}
      deleteDialogProps={deleteDialogProps}
    />
  );
};

export default ToDoListPage;
