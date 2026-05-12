import { FC, useEffect, useState } from 'react';

import Popup from '@atoms/Popup/Popup';
import Button from '@atoms/Button/Button';
import DeleteConfirmationPopup from '@molecules/DeleteConfirmationPopup/DeleteConfirmationPopup';

interface IActionItem {
  id: number;
  description: string;
  deadline: string;
  status: string;
}

interface IActionItemPopupProps {
  items: IActionItem[];
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  onSave: (payload: IActionItem) => void;
}

const ActionItemPopup: FC<IActionItemPopupProps> = ({
  items,
  isOpen,
  onClose,
  onDelete,
  onSave,
}) => {
  const [expandedId, setExpandedId] =
    useState<number | null>(null);

  const [showDeletePopup, setShowDeletePopup] =
    useState(false);

  const [selectedDeleteId, setSelectedDeleteId] =
    useState<number | null>(null);

  const [editingItem, setEditingItem] =
    useState<IActionItem | null>(null);

  const emptyItem: IActionItem = {
    id: 0,
    description: '',
    deadline: '',
    status: 'Pending',
  };

  useEffect(() => {
    if (!isOpen) {
      setExpandedId(null);
      setEditingItem(null);
    }
  }, [isOpen]);

  function handleCreate() {
    setEditingItem(emptyItem);
    setExpandedId(0);
  }

  function handleEdit(item: IActionItem) {
    setEditingItem(item);
    setExpandedId(item.id);
  }

  function handleSaveClick() {
    if (!editingItem) {
      return;
    }

    onSave(editingItem);
    setEditingItem(null);
  }

  return (
    <>
      <Popup
        isOpen={isOpen}
        variant="compact"
        titleId="action-items-popup-title"
        panelClassName="
          max-w-[850px]
          rounded-[40px]
          bg-[#386641]
          overflow-hidden
        "
      >
        <div className="p-8">

          <div className="mb-6 flex items-center justify-between">

            <div
              className="
                flex-1
                rounded-full
                bg-[#f4f0ea]
                px-8
                py-4
                text-center
                text-4xl
                font-bold
              "
            >
              ACTION ITEMS LIST
            </div>

            <button
              onClick={onClose}
              className="
                ml-6
                text-5xl
                font-bold
                text-pink-300
              "
            >
              ✕
            </button>

          </div>

          <div className="mb-6 flex justify-end">
            <Button
              label="CREATE"
              variant="nav"
              onClick={handleCreate}
            />
          </div>

          <div className="flex flex-col gap-5">

            {items.map((item) => {
              const isExpanded =
                expandedId === item.id;

              const isEditing =
                editingItem?.id === item.id;

              return (
                <div key={item.id}>

                  <div
                    className="
                      flex
                      items-center
                      rounded-full
                      bg-[#f4f0ea]
                      px-6
                      py-3
                    "
                  >

                    <button
                      onClick={() =>
                        setExpandedId(
                          isExpanded
                            ? null
                            : item.id
                        )
                      }
                      className="
                        mr-4
                        text-2xl
                        font-bold
                      "
                    >
                      ˅
                    </button>

                    <div
                      className="
                        flex-1
                        text-2xl
                        font-semibold
                      "
                    >
                      {item.description}
                    </div>

                    <div className="text-xl">
                      {item.deadline}
                    </div>

                  </div>

                  {isExpanded && (
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
                          value={
                            isEditing
                              ? editingItem.description
                              : item.description
                          }
                          onChange={(e) =>
                            setEditingItem({
                              ...(editingItem ||
                                item),
                              description:
                                e.target.value,
                            })
                          }
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
                          value={
                            isEditing
                              ? editingItem.deadline
                              : item.deadline
                          }
                          onChange={(e) =>
                            setEditingItem({
                              ...(editingItem ||
                                item),
                              deadline:
                                e.target.value,
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
                          value={
                            isEditing
                              ? editingItem.status
                              : item.status
                          }
                          onChange={(e) =>
                            setEditingItem({
                              ...(editingItem ||
                                item),
                              status:
                                e.target.value,
                            })
                          }
                          className="
                            rounded-xl
                            px-4
                            py-3
                            text-lg
                          "
                        >
                          <option>
                            Pending
                          </option>

                          <option>
                            In Progress
                          </option>

                          <option>
                            Done
                          </option>

                        </select>

                      </div>

                      <div className="flex gap-4">

                        <Button
                          label="SAVE"
                          variant="nav"
                          onClick={
                            handleSaveClick
                          }
                        />

                        <Button
                          label="EDIT"
                          variant="nav"
                          onClick={() =>
                            handleEdit(item)
                          }
                        />

                        <Button
                          label="DELETE"
                          variant="nav"
                          onClick={() => {
                            setSelectedDeleteId(
                              item.id
                            );

                            setShowDeletePopup(
                              true
                            );
                          }}
                        />

                      </div>

                    </div>
                  )}

                </div>
              );
            })}

            {editingItem?.id === 0 && (
              <div
                className="
                  rounded-[28px]
                  bg-[#f4f0ea]
                  p-6
                "
              >

                <textarea
                  placeholder="Action item description..."
                  value={
                    editingItem.description
                  }
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description:
                        e.target.value,
                    })
                  }
                  className="
                    mb-5
                    min-h-[140px]
                    w-full
                    rounded-[20px]
                    p-5
                    text-xl
                    outline-none
                  "
                />

                <div className="mb-5 flex gap-4">

                  <input
                    type="date"
                    value={
                      editingItem.deadline
                    }
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        deadline:
                          e.target.value,
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
                    value={
                      editingItem.status
                    }
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        status:
                          e.target.value,
                      })
                    }
                    className="
                      rounded-xl
                      px-4
                      py-3
                      text-lg
                    "
                  >
                    <option>
                      Pending
                    </option>

                    <option>
                      In Progress
                    </option>

                    <option>
                      Done
                    </option>

                  </select>

                </div>

                <Button
                  label="SAVE"
                  variant="nav"
                  onClick={
                    handleSaveClick
                  }
                />

              </div>
            )}

          </div>

        </div>
      </Popup>

      <DeleteConfirmationPopup
        isOpen={showDeletePopup}
        onConfirm={() => {
          if (selectedDeleteId) {
            onDelete(selectedDeleteId);
          }

          setShowDeletePopup(false);
        }}
        onCancel={() =>
          setShowDeletePopup(false)
        }
      />
    </>
  );
};

export default ActionItemPopup;

/* import { FC, useState } from 'react';

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

export default ActionItemPopup; */