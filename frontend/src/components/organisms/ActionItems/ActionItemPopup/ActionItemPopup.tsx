import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Popup from '@atoms/Popup/Popup';
import { ActionItemConfirmationDialog } from '@molecules/ConfirmationDialog/ConfirmationDialog';
import ActionItemList from '@organisms/ActionItems/ActionItemList/ActionItemList';
import ActionItemListToolbar from '@organisms/ActionItems/ActionItemListToolbar/ActionItemListToolbar';
import useActionItemListLogic from '@/hooks/useActionItemListLogic';
import { IActionItemPopupProps } from './IActionItemPopup';

const ActionItemPopup: FC<IActionItemPopupProps> = ({ isOpen, onClose: _onClose, ...props }) => {
  const { filteredItems, toolbarProps, addControls, listProps, deleteDialogProps } =
    useActionItemListLogic({
      items: props.items,
      onSave: props.onSave,
      onDelete: props.onDelete,
      deletingId: props.deletingId,
      savingId: props.savingId,
    });

  const isPanel = props.variant === 'panel';

  const content = (
    <>
      <div className="flex items-center justify-between gap-2 border-b border-[#7f9d86]/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#3d5f46]">
            Action Items List
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="add"
            onClick={addControls.onStartAdd}
            aria-label="Add action item"
            disabled={addControls.isAdding}
            label="+"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4 pt-3">
        <ActionItemListToolbar {...toolbarProps} variant="popup" />

        <div className="min-h-0 flex-1 max-h-[320px] overflow-y-auto pr-1">
          <ActionItemList
            variant={isPanel ? 'panel' : 'default'}
            items={filteredItems}
            isLoading={props.isLoading}
            error={props.error}
            addControls={addControls}
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
    </>
  );

  return isPanel ? (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#7f9d86]/20 bg-[#f6f1e8] shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
      {content}
      <ActionItemConfirmationDialog {...deleteDialogProps} />
    </div>
  ) : (
    <>
      <Popup
        isOpen={isOpen}
        titleId="action-items-title"
        variant="confirm"
        panelClassName="flex h-[500px] w-[720px] max-w-[720px] flex-col [&>div]:min-h-0"
      >
        {content}
      </Popup>

      <ActionItemConfirmationDialog {...deleteDialogProps} />
    </>
  );
};

export default ActionItemPopup;
