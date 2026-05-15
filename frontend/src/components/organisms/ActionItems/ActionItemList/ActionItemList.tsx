import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Select from '@atoms/Select/Select';
import GenericList from '@molecules/GenericList/GenericList';
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
  savingId,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-[#7f9d86]/40 bg-[#efebe2] p-8 text-center text-[#1f2937]/60">
        Loading action items...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[#b33a3a]/30 bg-[#f4c7c7]/30 p-6 text-center text-[#6b1f1f]">
        {error}
      </div>
    );
  }

  return (
    <GenericList<IActionItem>
      items={items}
      getItemId={(item) => item.id}
      expandedId={expandedId}
      onToggleExpand={(id) => onToggleExpand(id as number)}
      emptyMessage="No action items found."
      renderLeft={(item) => {
        const isEditing = !!editingItem && editingItem.id === item.id;
        if (isEditing && editingItem) {
          return (
            <div className="flex flex-1 flex-col gap-2">
              <Input
                value={editingItem.description}
                onChange={(e) =>
                  onEditingItemChange({ ...editingItem, description: e.target.value })
                }
                placeholder="Description"
              />
              <Input
                variant="date"
                value={editingItem.deadline}
                onChange={(e) =>
                  onEditingItemChange({ ...editingItem, deadline: e.target.value })
                }
              />
            </div>
          );
        }
        return (
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-lg font-semibold text-[#1f2937]">
              {item.description}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d5f46]">
              Deadline: {item.deadline || 'No deadline'}
            </span>
          </div>
        );
      }}
      renderRight={(item) => {
        const isEditing = !!editingItem && editingItem.id === item.id;
        if (isEditing && editingItem) {
          return (
            <div className="flex items-center gap-4">
              <Select
                className="w-[150px] mr-4"
                value={editingItem.status}
                onChange={(e) =>
                  onEditingItemChange({ ...editingItem, status: e.target.value })
                }
                options={[
                  { value: 'Pending', label: 'Pending' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Done', label: 'Done' },
                ]}
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="icon-delete"
                  onClick={() => onRequestDelete(item.id)}
                  aria-label="Delete action item"
                  icon={<Icon name="trash" className="h-5 w-5" />}
                />
                <Button
                  variant="icon-ghost"
                  onClick={onSave}
                  aria-label="Save changes"
                  icon={<Icon name="save" className="h-5 w-5" />}
                />
                <Button
                  variant="icon-ghost"
                  onClick={onCancelEdit}
                  aria-label="Cancel editing"
                  icon={<Icon name="close" className="h-5 w-5" />}
                />
              </div>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#efebe2] px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-[#386641]">
              {item.status}
            </span>
            <Button
              variant="icon-ghost"
              onClick={() => onEditingItemChange(item)}
              aria-label="Edit action item"
              className="h-8 w-8"
              icon={<Icon name="edit" className="h-5 w-5" />}
            />
          </div>
        );
      }}
    />
  );
};

export default ActionItemList;
