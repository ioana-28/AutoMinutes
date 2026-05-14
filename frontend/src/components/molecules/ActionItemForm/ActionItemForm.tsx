import { FC } from 'react';
import Button from '@atoms/Button/Button';
import { ActionItemFormProps } from './IActionItemForm';

const ActionItemForm: FC<ActionItemFormProps> = ({
  item,
  onSave,
  onCancel,
  onDelete,
  onChange,
  isNew = false,
}) => {
  return (
    <div
      className="
        mt-3
        rounded-[28px]
        bg-[#f4f0ea]
        p-6
      "
    >
      <div className="mb-5">
        <textarea
          value={item.description}
          onChange={(e) =>
            onChange({
              ...item,
              description: e.target.value,
            })
          }
          placeholder="Action item description..."
          className="
            min-h-[140px]
            w-full
            rounded-[20px]
            p-5
            text-xl
            outline-none
          "
        />
      </div>

      <div className="mb-5 flex gap-4">
        <input
          type="date"
          value={item.deadline}
          onChange={(e) =>
            onChange({
              ...item,
              deadline: e.target.value,
            })
          }
          className="
            rounded-xl
            px-4
            py-3
            text-lg
          "
        />

        <select
          value={item.status}
          onChange={(e) =>
            onChange({
              ...item,
              status: e.target.value,
            })
          }
          className="
            rounded-xl
            px-4
            py-3
            text-lg
          "
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
      </div>

      <div className="flex gap-4">
        <Button label="SAVE" variant="nav" onClick={onSave} />
        {!isNew && <Button label="CANCEL" variant="nav" onClick={onCancel} />}
        {isNew && <Button label="CANCEL" variant="nav" onClick={onCancel} />}
        {!isNew && onDelete && (
          <Button label="DELETE" variant="nav" onClick={onDelete} />
        )}
      </div>
    </div>
  );
};

export default ActionItemForm;
