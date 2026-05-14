import { FC } from 'react';
import ActionItemForm from '@molecules/ActionItemForm/ActionItemForm';
import { ICreateActionItemSectionProps } from './ICreateActionItemSection';

const CreateActionItemSection: FC<ICreateActionItemSectionProps> = ({
  item,
  onSave,
  onCancel,
  onChange,
  isSaving = false,
}) => {
  return (
    <div className="rounded-[28px] border-2 border-[#1e3522] bg-[#386641] p-4 shadow-lg">
      <div className="mb-2 text-sm font-bold uppercase tracking-wider text-white">
        New Action Item
      </div>
      <ActionItemForm
        item={item}
        onSave={onSave}
        onCancel={onCancel}
        onChange={onChange}
        isNew
      />
      {isSaving && (
        <div className="mt-2 text-center text-xs font-semibold text-white">
          Saving...
        </div>
      )}
    </div>
  );
};

export default CreateActionItemSection;
