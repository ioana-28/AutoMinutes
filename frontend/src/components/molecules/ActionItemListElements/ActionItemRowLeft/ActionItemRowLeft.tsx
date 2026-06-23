import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import { ActionItemStatus } from '@/hooks/useActionItems';
import { ActionItemRowLeftProps } from './IActionItemRowLeft';

const ActionItemRowLeft: FC<ActionItemRowLeftProps> = ({
  item,
  isPanel,
  editingItem,
  onEditingItemChange,
  onSaveItem,
}) => {
  const isEditing = !!editingItem && editingItem.id === item.id;
  
  const getNormalizedActionItemStatus = (status: string) =>
    status.trim().toUpperCase();

  const normalizedStatus = getNormalizedActionItemStatus(item.status);
  const isDone = normalizedStatus === 'DONE';

  if (isEditing && editingItem) {
    return (
      <div className={`flex flex-1 ${isPanel ? 'flex-col gap-1.5 sm:gap-2' : 'flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4'}`}>
        <Input
          variant={isPanel ? 'compact' : 'text'}
          value={editingItem.description ?? ''}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            onEditingItemChange({
              ...editingItem,
              description: e.target.value,
            })
          }
          placeholder="Description"
          className={isPanel ? '' : 'flex-1'}
        />
        <Input
          variant={isPanel ? 'compact' : 'date'}
          type="date"
          value={editingItem.deadline ?? ''}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            onEditingItemChange({
              ...editingItem,
              deadline: e.target.value,
            })
          }
          className={isPanel ? '' : 'w-full sm:w-[200px]'}
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-1 ${isPanel ? 'gap-1.5 sm:gap-2' : 'items-center gap-2 sm:gap-4'}`}>
      <div className="relative flex items-center">
        <Button
          variant="icon-ghost"
          onClick={(e) => {
            e.stopPropagation();
            let nextStatus: ActionItemStatus;
            let nextPreviousStatus: ActionItemStatus | null | undefined = item.previousStatus;

            if (isDone) {
              const normalizedPrev = item.previousStatus ? getNormalizedActionItemStatus(item.previousStatus) : null;
              
              if (normalizedPrev && normalizedPrev !== 'DONE') {
                nextStatus = normalizedPrev as ActionItemStatus;
              } else {
                nextStatus = 'OPEN';
              }
              nextPreviousStatus = null;
            } else {
              nextStatus = 'DONE';
              nextPreviousStatus = item.status;
            }

            onSaveItem({
              ...item,
              status: nextStatus,
              previousStatus: nextPreviousStatus,
            });
          }}
          aria-label={isDone ? 'Mark as open' : 'Mark as done'}
          className={`h-7 w-7 sm:h-8 sm:w-8 transition-colors ${isDone ? 'text-green-600' : 'text-[#d4ccbc] hover:text-[#386641]'}`}
          icon={<Icon name="check" className="h-4 w-4 sm:h-5 sm:w-5" />}
        />
      </div>
      <div className={`flex flex-1 ${isPanel ? 'flex-col gap-1' : 'items-center gap-2 sm:gap-4'}`}>
        <p className={`text-[#1f2937] ${isPanel ? 'text-[11px]' : 'text-xs sm:text-sm'}`}>
          {item.description.length > 50
            ? `${item.description.slice(0, 50)}...`
            : item.description}
        </p>
        <span className={`text-[#3d5f46]/70 ${isPanel ? 'text-[10px]' : 'text-[10px] sm:text-xs'}`}>
          {item.deadline || 'No deadline'}
        </span>
      </div>
    </div>
  );
};

export default ActionItemRowLeft;