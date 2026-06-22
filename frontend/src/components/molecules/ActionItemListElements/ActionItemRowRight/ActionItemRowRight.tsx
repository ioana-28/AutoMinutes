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
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center ${isPanel ? 'gap-1.5' : 'gap-2.5 sm:gap-4'}`}>
        <Select
          variant={isPanel ? 'compact' : 'default'}
          className={isPanel ? 'w-[80px] sm:w-[100px]' : 'w-full sm:w-[150px] sm:mr-4'}
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
        <div className="flex items-center justify-end gap-1 sm:gap-1.5">
          <Button
            variant="icon-delete"
            onClick={(e) => {
              e.stopPropagation();
              onRequestDelete(item.id);
            }}
            aria-label="Delete action item"
            className={isPanel ? 'h-6 w-6 sm:h-7 sm:w-7' : 'h-7 w-7 sm:h-8 sm:w-8'}
            icon={<Icon name="trash" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} />}
          />
          <Button
            variant="icon-ghost"
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            aria-label="Save changes"
            className={isPanel ? 'h-6 w-6 sm:h-7 sm:w-7' : 'h-7 w-7 sm:h-8 sm:w-8'}
            icon={<Icon name="save" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} />}
          />
          <Button
            variant="icon-ghost"
            onClick={(e) => {
              e.stopPropagation();
              onCancelEdit();
            }}
            aria-label="Cancel editing"
            className={isPanel ? 'h-6 w-6 sm:h-7 sm:w-7' : 'h-7 w-7 sm:h-8 sm:w-8'}
            icon={<Icon name="close" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} />}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${isPanel ? 'gap-1.5 sm:gap-2' : 'gap-2 sm:gap-3'}`}>
      <div className="relative flex items-center gap-1 sm:gap-2">
        <span
          className={`rounded-full border font-bold uppercase tracking-[0.1em] text-[#2F3A3A] ${getActionItemStatusPillClasses(item.status)} ${isPanel ? 'px-1 py-0 text-[8.5px] sm:px-1.5 sm:py-0 sm:text-[9.5px]' : 'px-1.5 py-0 text-[9px] sm:px-2 sm:py-0.5 sm:text-[10px]'}`}
        >
          {getStatusLabel(item.status)}
        </span>
        {lowConfidence && (
          <Icon name="alert" className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500" />
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
        className={isPanel ? 'h-6 w-6 sm:h-7 sm:w-7' : 'h-7 w-7 sm:h-8 sm:w-8'}
        icon={<Icon name="edit" className={isPanel ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} />}
      />
    </div>
  );
};

export default ActionItemRowRight;