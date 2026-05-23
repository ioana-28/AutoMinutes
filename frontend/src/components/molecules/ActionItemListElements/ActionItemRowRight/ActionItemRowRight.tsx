import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Select from '@atoms/Select/Select';
import { ActionItemStatus } from '@/hooks/useActionItems';
import { ActionItemRowRightProps } from './IActionItemRowRight';

const ActionItemRowRight: FC<ActionItemRowRightProps> = ({
  item,
  isPanel,
  editingItem,
  onEditingItemChange,
  onRequestDelete,
  onSave,
  onCancelEdit,
  lowConfidence,
  statusOptions,
  getStatusLabel,
  getActionItemStatusPillClasses,
}) => {
  const isEditing = !!editingItem && editingItem.id === item.id;

  if (isEditing && editingItem) {
    return (
      <div className={`flex items-center ${isPanel ? 'gap-2' : 'gap-4'}`}>
        <Select
          variant={isPanel ? 'compact' : 'default'}
          className={isPanel ? 'w-[100px]' : 'w-[150px] mr-4'}
          value={editingItem.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            const newStatus = e.target.value as ActionItemStatus;
            onEditingItemChange({
              ...editingItem,
              status: newStatus,
              previousStatus: newStatus,
            });
          }}
          options={statusOptions}
        />
        <div className="flex items-center gap-1.5">
          <Button
            variant="icon-delete"
            onClick={(e) => {
              e.stopPropagation();
              onRequestDelete(item.id);
            }}
            aria-label="Delete action item"
            className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
            icon={<Icon name="trash" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
          />
          <Button
            variant="icon-ghost"
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            aria-label="Save changes"
            className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
            icon={<Icon name="save" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
          />
          <Button
            variant="icon-ghost"
            onClick={(e) => {
              e.stopPropagation();
              onCancelEdit();
            }}
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
      <div className="relative flex items-center gap-2">
        <span
          className={`rounded-full border font-bold uppercase tracking-[0.1em] text-[#2F3A3A] ${getActionItemStatusPillClasses(item.status)} ${isPanel ? 'px-1.5 py-0 text-[9.5px]' : 'px-2 py-0.5 text-[10px]'}`}
        >
          {getStatusLabel(item.status)}
        </span>
        {lowConfidence && (
          <Icon name="alert" className="h-3.5 w-3.5 text-amber-500" />
        )}
      </div>
      <Button
        variant="icon-ghost"
        onClick={(e) => {
          e.stopPropagation();
          onEditingItemChange({
            ...item,
            assignee: item.assignee ?? null,
          });
        }}
        aria-label="Edit action item"
        className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
        icon={<Icon name="edit" className={isPanel ? 'h-4 w-4' : 'h-5 w-5'} />}
      />
    </div>
  );
};

export default ActionItemRowRight;