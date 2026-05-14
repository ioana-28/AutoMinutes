import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import Button from '@atoms/Button/Button';
import ActionItemList from '@organisms/ActionItemList/ActionItemList';
import ActionItemListToolbar from '@organisms/ActionItemListToolbar/ActionItemListToolbar';
import ActionItemDeleteDialog from '@organisms/ActionItemDeleteDialog/ActionItemDeleteDialog';
import CreateActionItemSection from '@organisms/CreateActionItemSection/CreateActionItemSection';

import { IToDoListTemplateProps } from './IToDoListTemplate';

const ToDoListTemplate: FC<IToDoListTemplateProps> = ({
  activePage,
  items,
  isLoading,
  error,
  deletingId,
  savingId,
  toolbarProps,
  addControls,
  listProps,
  deleteDialogProps,
}) => {
  const navigate = useNavigate();

  return (
    <MeetingLayoutTemplate
      activePage={activePage}
      onNavigateMeetingList={() => navigate('/meeting-list')}
      onNavigateToDoList={() => navigate('/to-do-list')}
      contentClassName="max-w-[1100px]"
      addMeetingSlot={
        <Button
          label="ADD ACTION ITEM"
          variant="nav"
          onClick={addControls.onOpenAdd}
          disabled={addControls.isAdding}
        />
      }
      toolbarSlot={<ActionItemListToolbar {...toolbarProps} />}
    >
      <div className="min-h-[700px] rounded-b-[40px] bg-[#cad2c5] px-2 py-4 flex flex-col gap-6">
        {addControls.isAdding && listProps.editingItem && listProps.editingItem.id === 0 ? (
          <CreateActionItemSection
            item={listProps.editingItem}
            onSave={listProps.onSave}
            onCancel={addControls.onCancelAdd}
            onChange={listProps.setEditingItem}
            isSaving={savingId === 0}
          />
        ) : null}

        <div className="flex flex-col gap-5">
          <div className="flex items-center rounded-[22px] bg-[#f4f0ea] px-6 py-3 font-semibold">
            <div className="flex-1 text-xl">ACTION ITEM</div>
            <div className="w-[150px] text-center text-xl">Deadline</div>
            <div className="w-[150px] text-center text-xl">Status</div>
          </div>

          <ActionItemList
            items={items}
            isLoading={isLoading}
            error={error}
            expandedId={listProps.expandedId}
            onToggleExpand={listProps.onToggleExpand}
            editingItem={listProps.editingItem}
            onEditingItemChange={listProps.setEditingItem}
            onSave={listProps.onSave}
            onCancelEdit={listProps.onCancelEdit}
            onRequestDelete={listProps.onRequestDelete}
            savingId={savingId}
          />
        </div>
      </div>

      <ActionItemDeleteDialog {...deleteDialogProps} />
    </MeetingLayoutTemplate>
  );
};

export default ToDoListTemplate;
