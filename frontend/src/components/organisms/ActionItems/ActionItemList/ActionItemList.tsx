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
  addControls,
  expandedId,
  onToggleExpand,
  editingItem,
  onEditingItemChange,
  onSave,
  onCancelEdit,
  onRequestDelete,
  savingId: _savingId,
}) => {
  const isPanel = variant === 'panel';

  const renderAddRow = () => {
    const { addItem } = addControls;
    if (!addControls.isAdding || !addItem) return null;

    return (
      <div
        className={`mx-auto w-full max-w-[520px] rounded-xl border border-[#7f9d86]/30 bg-[#efebe2] px-3 py-2.5 shadow-sm ${isPanel ? 'mb-2' : 'mb-3'}`}
      >
        <div className={`flex flex-col gap-2.5 ${isPanel ? '' : 'lg:flex-row lg:items-start'}`}>
          <textarea
            value={addItem.description}
            onChange={(event) =>
              addControls.onAddItemChange({
                ...addItem,
                description: event.target.value,
              })
            }
            placeholder="Enter action item description..."
            className={`min-h-[68px] w-full rounded-md border border-[#7f9d86]/20 bg-[#f8f4ec] p-2.5 text-[0.88rem] text-[#1f2937] placeholder:text-[#3d5f46]/40 focus:outline-none focus:ring-1 focus:ring-[#7f9d86] ${isPanel ? '' : 'lg:flex-1'}`}
          />

          <div className={`flex flex-col gap-2 ${isPanel ? '' : 'min-w-[140px] lg:max-w-[150px]'}`}>
            <Input
              variant={isPanel ? 'compact' : 'date'}
              type="date"
              value={addItem.deadline}
              onChange={(event) =>
                addControls.onAddItemChange({
                  ...addItem,
                  deadline: event.target.value,
                })
              }
            />
            <Select
              variant={isPanel ? 'compact' : 'default'}
              value={addItem.status}
              onChange={(event) =>
                addControls.onAddItemChange({
                  ...addItem,
                  status: event.target.value,
                })
              }
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Done', label: 'Done' },
              ]}
            />
          </div>

          <div className="flex items-center gap-1 self-start pt-0.5">
            <Button
              variant="icon-ghost"
              onClick={addControls.onSaveAdd}
              aria-label="Save new action item"
              className={isPanel ? 'h-7 w-7' : 'h-7 w-7'}
              disabled={addControls.isSaving}
              icon={<Icon name="save" className="h-3.5 w-3.5" />}
            />
            <Button
              variant="icon-close"
              onClick={addControls.onCancelAdd}
              aria-label="Cancel adding action item"
              className={isPanel ? 'h-7 w-7' : 'h-7 w-7'}
              icon={<Icon name="close" className="h-3.5 w-3.5" />}
            />
          </div>
        </div>

        {addControls.addError ? (
          <p className="mt-2 text-[11px] font-medium text-[#a94442]">{addControls.addError}</p>
        ) : null}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div
        className={`rounded-lg border border-dashed border-[#7f9d86]/40 bg-[#efebe2] text-center text-[#1f2937]/60 ${isPanel ? 'p-4 text-xs' : 'p-8'}`}
      >
        Loading action items...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`rounded-lg border border-[#b33a3a]/30 bg-[#f4c7c7]/30 text-center text-[#6b1f1f] ${isPanel ? 'p-4 text-xs' : 'p-6'}`}
      >
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {renderAddRow()}

      <GenericList<IActionItem>
        items={items}
        variant={variant}
        getItemId={(item) => item.id}
        expandedId={expandedId}
        onToggleExpand={(id) => onToggleExpand(id as number)}
        onItemClick={(id) => {
          // Don't expand if clicking while editing this specific row
          if (editingItem?.id !== id) {
            onToggleExpand(id as number);
          }
        }}
        emptyMessage="No action items found."
        renderExpanded={(item) => (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3d5f46]/50">
              Full Description
            </span>
            <p className="whitespace-pre-line leading-relaxed text-[#1f2937]">{item.description}</p>
          </div>
        )}
        renderLeft={(item) => {
          const isEditing = !!editingItem && editingItem.id === item.id;
          if (isEditing && editingItem) {
            return (
              <div className={`flex flex-1 ${isPanel ? 'flex-col gap-2' : 'items-center gap-4'}`}>
                <Input
                  variant={isPanel ? 'compact' : 'text'}
                  value={editingItem.description}
                  onClick={(e) => e.stopPropagation()}
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
                  onClick={(e) => e.stopPropagation()}
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
              <span
                className={`${isPanel ? 'w-28 text-[9px]' : 'w-36 text-[10px]'} shrink-0 whitespace-nowrap font-bold uppercase tracking-widest text-[#3d5f46]/50`}
              >
                Deadline: {item.deadline || 'None'}
              </span>
              <span
                className={`truncate font-semibold text-[#1f2937] ${isPanel ? 'text-xs' : 'text-base'}`}
              >
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
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onEditingItemChange({ ...editingItem, status: e.target.value })}
                  options={[
                    { value: 'Pending', label: 'Pending' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Done', label: 'Done' },
                  ]}
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
              <span
                className={`rounded-full bg-[#efebe2] font-bold uppercase tracking-[0.1em] text-[#386641] ${isPanel ? 'px-2 py-0.5 text-[8px]' : 'px-3 py-1 text-xs'}`}
              >
                {item.status}
              </span>
              <Button
                variant="icon-ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditingItemChange(item);
                }}
                aria-label="Edit action item"
                className={isPanel ? 'h-7 w-7' : 'h-8 w-8'}
                icon={<Icon name="edit" className={isPanel ? 'h-4 w-4' : 'h-5 w-5'} />}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default ActionItemList;
