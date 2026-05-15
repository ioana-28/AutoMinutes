import { FC } from 'react';
import ToDoListTemplate from '@templates/ToDoListTemplate/ToDoListTemplate';
import AddMeetingModal from '@organisms/Meeting/AddMeetingModal/AddMeetingModal';
import { useActionItems } from '@/hooks/useActionItems';
import { useMeetings } from '@/hooks/useMeetings';
import useActionItemListLogic from '@/hooks/useActionItemListLogic';

const ToDoListPage: FC = () => {
  const {
    items,
    isLoading,
    error,
    deletingId,
    savingId,
    handleSaveActionItem,
    handleDeleteActionItem,
  } = useActionItems();

  const { isCreatingMeeting, createMeetingError, handleCreateMeeting } = useMeetings();

  const { filteredItems, toolbarProps, listProps, deleteDialogProps } =
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
      addMeetingSlot={
        <AddMeetingModal
          onCreateMeeting={handleCreateMeeting}
          isCreatingMeeting={isCreatingMeeting}
          createMeetingError={createMeetingError}
        />
      }
      toolbarProps={toolbarProps}
      listProps={listProps}
      deleteDialogProps={deleteDialogProps}
    />
  );
};

export default ToDoListPage;
