import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import ActionItemList from '@organisms/ActionItems/ActionItemList/ActionItemList';
import ActionItemListToolbar from '@organisms/ActionItems/ActionItemListToolbar/ActionItemListToolbar';
import { ActionItemConfirmationDialog } from '@molecules/ConfirmationDialog/ConfirmationDialog';

import { IToDoListTemplateProps } from './IToDoListTemplate';

const ToDoListTemplate: FC<IToDoListTemplateProps> = ({
  activePage,
  items,
  isLoading,
  error,
  deletingId: _deletingId,
  savingId,
  addMeetingSlot,
  toolbarProps,
  listProps,
  addControls,
  deleteDialogProps,
}) => {
  const navigate = useNavigate();

  return (
    <MeetingLayoutTemplate
      activePage={activePage}
      onNavigateMeetingList={() => navigate('/meeting-list')}
      onNavigateToDoList={() => navigate('/to-do-list')}
      contentClassName="p-4 max-w-none"
      addMeetingSlot={addMeetingSlot}
      toolbarSlot={<ActionItemListToolbar {...toolbarProps} />}
    >
      <ActionItemList
        items={items}
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

      <ActionItemConfirmationDialog {...deleteDialogProps} />
    </MeetingLayoutTemplate>
  );
};

export default ToDoListTemplate;
