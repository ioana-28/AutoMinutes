import { FC } from 'react';
import GenericList from '@organisms/GenericList/GenericList';
import ActionItemForm from '@molecules/ActionItemForm/ActionItemForm';
import { IActionItemListProps } from './IActionItemList';
import { IActionItem } from '@/hooks/useActionItems';

const ActionItemList: FC<IActionItemListProps> = ({
  items,
  isLoading,
  error,
  expandedId,
  onToggleExpand,
  editingItem,
  onEditingItemChange,
  onSave,
  onCancelEdit,
  onRequestDelete,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-[#7f9d86] bg-[#efebe2] p-10 text-center text-[#1f2937]">
        Loading action items...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[#b33a3a] bg-[#f4c7c7] p-6 text-center text-[#6b1f1f]">
        {error}
      </div>
    );
  }

  return (
    <GenericList<IActionItem>
      items={items}
      getItemId={(item) => item.id}
      expandedId={expandedId}
      onToggleExpand={onToggleExpand}
      emptyMessage="No action items found."
      renderLeft={(item) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-lg font-semibold text-[#1f2937]">
            {item.description}
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d5f46]">
            Deadline: {item.deadline || 'No deadline'}
          </span>
        </div>
      )}
      renderRight={(item) => (
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#efebe2] px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-[#386641]">
            {item.status}
          </span>
        </div>
      )}
      renderExpanded={(item) => (
        editingItem && editingItem.id === item.id ? (
          <ActionItemForm
            item={editingItem}
            onSave={onSave}
            onCancel={onCancelEdit}
            onDelete={() => onRequestDelete(item.id)}
            onChange={onEditingItemChange}
            isNew={false}
          />
        ) : null
      )}
    />
  );
};

export default ActionItemList;
