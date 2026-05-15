import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Select from '@atoms/Select/Select';
import GenericList from '@molecules/GenericList/GenericList';
import { IActionItemListProps } from './IActionItemList';
import { IActionItem } from '@/hooks/useActionItems';

const ActionItemList: FC<IActionItemListProps> = ({
  variant = 'default',
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
  const isPanel = variant === 'panel';

  if (isLoading) {
    return (
      <div className={`rounded-lg border border-dashed border-[#7f9d86]/40 bg-[#efebe2] text-center text-[#1f2937]/60 ${isPanel ? 'p-4 text-xs' : 'p-8'}`}>
        Loading action items...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-lg border border-[#b33a3a]/30 bg-[#f4c7c7]/30 text-center text-[#6b1f1f] ${isPanel ? 'p-4 text-xs' : 'p-6'}`}>
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
            <div className={`flex flex-1 ${isPanel ? 'flex-col gap-2' : 'items-center gap-4'}`}>
              <Input
                variant={isPanel ? 'compact' : 'text'}
                value={editingItem.description}
                onChange={(e) =>
                  onEditingItemChange({ ...editingItem, description: e.target.value })
                }
                placeholder="Description"
                className={isPanel ? '' : 'flex-1'}
              />
              <Input
                variant={isPanel ? 'compact' : 'date'}
                type="date"
                value={editingItem.deadline}
                onChange={(e) =>
                  onEditingItemChange({ ...editingItem, deadline: e.target.value })
                }
                className={isPanel ? '' : 'w-[200px]'}
              />
            </div>
          );
        }
        return (
          <div className={`flex min-w-0 items-center ${isPanel ? 'gap-3' : 'gap-6'}`}>
            <span className={`${isPanel ? 'w-28 text-[9px]' : 'w-36 text-[10px]'} shrink-0 whitespace-nowrap font-bold uppercase tracking-widest text-[#3d5f46]/50`}>
              Deadline: {item.deadline || 'None'}
            </span>
            <span className={`truncate font-semibold text-[#1f2937] ${isPanel ? 'text-xs' : 'text-base'}`}>
              {item.description}
            </span>
          </div>
        );
      }}
      renderRight={(item) => {
        const isEditing = !!editingItem && editingItem.id === item.id;
        if (isEditing && editingItem) {
          return (
            <div className={`flex items-center ${isPanel ? 'gap-2' : 'gap-4'}`}>
              <Select
                variant={isPanel ? 'compact' : 'default'}
                className={isPanel ? 'w-[100px]' : 'w-[150px] mr-4'}
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
              <div className="flex items-center gap-1.5">
                <Button
                  variant="icon-delete"
                  onClick={() => onRequestDelete(item.id)}
                  aria-label="Delete action item"
                  className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
                  icon={<Icon name="trash" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
                />
                <Button
                  variant="icon-ghost"
                  onClick={onSave}
                  aria-label="Save changes"
                  className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
                  icon={<Icon name="save" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
                />
                <Button
                  variant="icon-ghost"
                  onClick={onCancelEdit}
                  aria-label="Cancel editing"
                  className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
                  icon={<Icon name="close" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
                />
              </div>
            </div>
          );
        }
        return (
          <div className={`flex items-center ${isPanel ? 'gap-2' : 'gap-3'}`}>
            <span className={`rounded-full bg-[#efebe2] font-bold uppercase tracking-[0.1em] text-[#386641] ${isPanel ? 'px-2 py-0.5 text-[8px]' : 'px-3 py-1 text-xs'}`}>
              {item.status}
            </span>
            <Button
              variant="icon-ghost"
              onClick={() => onEditingItemChange(item)}
              aria-label="Edit action item"
              className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
              icon={<Icon name="edit" className={isPanel ? 'h-4 w-4' : 'h-5 w-5'} />}
            />
          </div>
        );
      }}
    />
  );
};

export default ActionItemList;
