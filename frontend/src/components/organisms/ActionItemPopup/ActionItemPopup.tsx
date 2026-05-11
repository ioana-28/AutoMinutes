import { FC, useState } from 'react';

import Popup from '@atoms/Popup/Popup';
import Button from '@atoms/Button/Button';
import DeleteConfirmationPopup from '@molecules/DeleteConfirmationPopup/DeleteConfirmationPopup';

interface IActionItemPopupProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  onSave: (payload: any) => void;
}

const ActionItemPopup: FC<IActionItemPopupProps> = ({
  item,
  isOpen,
  onClose,
  onDelete,
  onSave,
}) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [status, setStatus] = useState(
    item.status || 'Pending'
  );

  return (
    <>
      <Popup
        isOpen={isOpen}
        variant="compact"
        titleId="action-item-popup-title"
        panelClassName="
          max-w-[1000px]
          rounded-[40px]
          border-[4px]
          border-black
          bg-[#cad2c5]
          overflow-hidden
        "
      >
        <div className="flex items-center justify-between bg-[#386641] px-8 py-6">
          <div className="flex items-center gap-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="
                rounded-xl
                border-[3px]
                border-black
                px-4
                py-2
                text-lg
              "
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <Button
              label="SAVE"
              variant="nav"
              onClick={() =>
                onSave({
                  ...item,
                  status,
                })
              }
            />

            <Button
              label="DELETE"
              variant="nav"
              onClick={() => setShowDeletePopup(true)}
            />
          </div>

          <h1
            id="action-item-popup-title"
            className="text-4xl font-bold text-white"
          >
            {item.description}
          </h1>

          <button
            onClick={onClose}
            className="text-5xl font-bold text-pink-300"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6 flex gap-4">
            <div
              className="
                flex-1
                rounded-[22px]
                border-[4px]
                border-black
                bg-[#f4f0ea]
                p-4
                text-center
                text-2xl
                font-semibold
              "
            >
              Meeting Name
            </div>

            <div
              className="
                flex-1
                rounded-[22px]
                border-[4px]
                border-black
                bg-[#f4f0ea]
                p-4
                text-center
                text-2xl
              "
            >
              Meeting short description
            </div>
          </div>

          <div
            className="
              rounded-[30px]
              border-[4px]
              border-black
              bg-[#adc2b4]
              p-6
            "
          >
            <div
              className="
                rounded-[26px]
                border-[4px]
                border-black
                bg-[#f4f0ea]
                p-8
              "
            >
              <h2 className="mb-6 text-3xl font-bold">
                Task Description
              </h2>

              <p className="text-xl leading-9">
                {item.description}
              </p>

              <div className="mt-6 text-lg font-medium">
                Deadline: {item.deadline || 'No deadline'}
              </div>
            </div>
          </div>
        </div>
      </Popup>

      <DeleteConfirmationPopup
        isOpen={showDeletePopup}
        onConfirm={() => onDelete(item.id)}
        onCancel={() => setShowDeletePopup(false)}
      />
    </>
  );
};

export default ActionItemPopup;