import { FC, useState } from 'react';
import ToDoListTemplate from '@templates/ToDoListTemplate/ToDoListTemplate';
import { useActionItems } from '@/hooks/useActionItems';
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
      toolbarProps={toolbarProps}
      addControls={addControls}
      listProps={listProps}
      deleteDialogProps={deleteDialogProps}
    />
  );
};

export default ToDoListPage;
