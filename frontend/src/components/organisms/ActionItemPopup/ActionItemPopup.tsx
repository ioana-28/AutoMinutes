import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Popup from '@atoms/Popup/Popup';
import ActionItemDeleteDialog from '@organisms/ActionItemDeleteDialog/ActionItemDeleteDialog';
import ActionItemList from '@organisms/ActionItemList/ActionItemList';
import ActionItemListToolbar from '@organisms/ActionItemListToolbar/ActionItemListToolbar';
import AddActionItemModal from '@organisms/AddActionItemModal/AddActionItemModal';
import useActionItemListLogic from '@/hooks/useActionItemListLogic';
import { IActionItemPopupProps } from './IActionItemPopup';

const ActionItemPopup: FC<IActionItemPopupProps> = ({ isOpen, onClose, ...props }) => {
  const { filteredItems, toolbarProps, addControls, listProps, deleteDialogProps } =
    useActionItemListLogic(props);

  return (
    <>
      <Popup
        isOpen={isOpen}
        titleId="action-items-title"
        variant="confirm"
        panelClassName="flex h-[600px] w-[800px] max-w-[800px] flex-col [&>div]:min-h-0"
      >
        <div className="relative flex items-center justify-end gap-2 px-4 pt-4">
          <h2 className="bg-transparent">Action Items List</h2>

          <AddActionItemModal
            onSave={addControls.onSaveAdd}
            isSaving={props.savingId === 0}
            error={props.error}
            triggerVariant="add"
          />

          <Button
            variant="icon-close"
            onClick={onClose}
            aria-label="Close action items popup"
            icon={<Icon name="close" className="h-6 w-6" />}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4">
          <ActionItemListToolbar {...toolbarProps} variant="popup" />

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <ActionItemList
              items={filteredItems}
              isLoading={props.isLoading}
              error={props.error}
              expandedId={listProps.expandedId}
              onToggleExpand={listProps.onToggleExpand}
              editingItem={listProps.editingItem}
              onEditingItemChange={listProps.setEditingItem}
              onSave={listProps.onSave}
              onCancelEdit={listProps.onCancelEdit}
              onRequestDelete={listProps.onRequestDelete}
              savingId={props.savingId}
            />
          </div>
        </div>
      </Popup>

      <ActionItemDeleteDialog {...deleteDialogProps} />
    </>
  );
};

export default ActionItemPopup;
