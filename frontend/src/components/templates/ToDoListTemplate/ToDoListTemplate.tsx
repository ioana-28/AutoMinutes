import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import Input from '@atoms/Input/Input';
import Button from '@atoms/Button/Button';

import ActionItemPopup from '@organisms/ActionItemPopup/ActionItemPopup';

import { IToDoListTemplateProps } from './IToDoListTemplate';

const ToDoListTemplate: FC<IToDoListTemplateProps> = ({
  activePage,
  items,
  search,
  setSearch,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  selectedItem,
  setSelectedItem,
  handleDelete,
  handleSave,
}) => {
  const navigate = useNavigate();

  return (
    <MeetingLayoutTemplate
      activePage={activePage}
      onNavigateMeetingList={() =>
        navigate('/meeting-list')
      }
      onNavigateToDoList={() =>
        navigate('/to-do-list')
      }
      contentClassName="max-w-[1100px]"
      addMeetingSlot={
        <Button
          label="ADD MEETING"
          variant="nav"
          onClick={() =>
            navigate('/new-meeting')
          }
        />
      }
      toolbarSlot={
        <div className="flex w-full items-center gap-5">

          <div className="w-[220px]">
            <Input
              variant="text"
              value="your@email.com"
              readOnly
              className="
                rounded-[22px]
                bg-[#f4f0ea]
              "
            />
          </div>

          <div
            className="
              flex
              flex-1
              items-center
              rounded-[22px]
              bg-[#f4f0ea]
              px-4
            "
          >
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                h-[52px]
                w-full
                bg-transparent
                text-lg
                outline-none
              "
            />

            <button className="text-2xl">
              ⌕
            </button>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                setShowFilters(
                  (previous) => !previous
                )
              }
              className="
                flex
                h-[52px]
                w-[52px]
                items-center
                justify-center
                rounded-[18px]
                bg-[#f4f0ea]
                text-2xl
                font-bold
              "
            >
              ☰
            </button>

            {showFilters && (
              <div className="w-[180px]">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value
                    )
                  }
                  className="
                    h-[52px]
                    w-full
                    rounded-[22px]
                    bg-[#f4f0ea]
                    px-4
                    text-lg
                    font-semibold
                  "
                >
                  <option>Date</option>
                  <option>Status</option>
                  <option>Name</option>
                </select>
              </div>
            )}

          </div>
        </div>
      }
    >
      <div
        className="
          min-h-[700px]
          rounded-b-[40px]
          bg-[#cad2c5]
          px-2
          py-4
        "
      >
        <div className="flex flex-col gap-5">

          <div
            className="
              flex
              items-center
              rounded-[22px]
              bg-[#f4f0ea]
              px-6
              py-3
              font-semibold
            "
          >
            <div className="flex-1 text-xl">
              ACTION ITEM NAME
            </div>

            <div className="w-[260px] text-center text-xl">
              MEETING NAME
            </div>

            <div className="w-[150px] text-center text-xl">
              Date
            </div>

            <div className="w-[150px] text-center text-xl">
              Status
            </div>

            <div className="ml-3 w-10" />
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2"
            >
              <div
                className="
                  flex
                  items-center
                  rounded-[28px]
                  bg-[#f4f0ea]
                  px-6
                  py-4
                "
              >
                <div className="flex flex-1 items-center gap-4">

                  <button
                    onClick={() =>
                      setSelectedItem(item)
                    }
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      text-lg
                      font-bold
                    "
                  >
                    ›
                  </button>

                  <p className="text-xl font-semibold uppercase">
                    {item.description}
                  </p>
                </div>

                <div className="w-[260px] text-center text-xl">
                  Meeting Name
                </div>

                <div className="w-[150px] text-center text-lg">
                  {item.deadline}
                </div>

                <div className="w-[150px] text-center text-lg">
                  {item.status}
                </div>

                <button
                  onClick={() =>
                    setSelectedItem(item)
                  }
                  className="
                    ml-3
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    text-xl
                    font-bold
                    bg-[#dce8dd]
                    text-[#3f6f44]
                  "
                >
                  i
                </button>
              </div>
            </div>
          ))}

          {selectedItem ? (
            <ActionItemPopup
              items={items}
              isOpen={true}
              onClose={() =>
                setSelectedItem(null)
              }
              onDelete={handleDelete}
              onSave={handleSave}
            />
          ) : null}

        </div>
      </div>
    </MeetingLayoutTemplate>
  );
};

export default ToDoListTemplate;

//TEST MOCK DATA
/* import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import Input from '@atoms/Input/Input';
import Button from '@atoms/Button/Button';

import ActionItemPopup from '@organisms/ActionItemPopup/ActionItemPopup';

import { IToDoListTemplateProps } from './IToDoListTemplate';

const ToDoListTemplate: FC<IToDoListTemplateProps> = ({
  activePage,
}) => {
  const navigate = useNavigate();

  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Date');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<any | null>(null);

  useEffect(() => {
    // MOCK DATA
    setItems([
      {
        id: 1,
        description: 'Prepare presentation',
        deadline: '12/05/2026',
        status: 'Pending',
      },
      {
        id: 2,
        description: 'Send meeting notes',
        deadline: '15/05/2026',
        status: 'Done',
      },
    ]);
  }, []);

  function handleDelete(id: number) {
    setItems((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setSelectedItem(null);
  }

  function handleSave(payload: any) {
    setItems((previous) =>
      previous.map((item) =>
        item.id === payload.id ? payload : item
      )
    );

    setSelectedItem(payload);
  }

  const filteredItems = items
    .filter((item) =>
      item.description
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'Name') {
        return a.description.localeCompare(
          b.description
        );
      }

      if (sortBy === 'Status') {
        return a.status.localeCompare(
          b.status
        );
      }

      return 0;
    });

  return (
    <MeetingLayoutTemplate
      activePage={activePage}
      onNavigateMeetingList={() =>
        navigate('/meeting-list')
      }
      onNavigateToDoList={() =>
        navigate('/to-do-list')
      }
      contentClassName="max-w-[1100px]"
      addMeetingSlot={
        <Button
          label="ADD MEETING"
          variant="nav"
          onClick={() => navigate('/new-meeting')}
        />
      }
      toolbarSlot={
      <div className="flex w-full items-center gap-5">

        <div className="w-[220px]">
          <Input
            variant="text"
            value="your@email.com"
            readOnly
            className="
              rounded-[22px]
              border-[3px]
              border-black
              bg-[#f4f0ea]
            "
          />
        </div>

        <div
          className="
            flex
            flex-1
            items-center
            rounded-[22px]
            border-[3px]
            border-black
            bg-[#f4f0ea]
            px-4
          "
        >
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              h-[52px]
              w-full
              bg-transparent
              text-lg
              outline-none
            "
          />

          <button className="text-2xl">
            ⌕
          </button>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() =>
              setShowFilters(
                (previous) => !previous
              )
            }
            className="
              flex
              h-[52px]
              w-[52px]
              items-center
              justify-center
              rounded-[18px]
              border-[3px]
              border-black
              bg-[#f4f0ea]
              text-2xl
              font-bold
            "
          >
            ☰
          </button>

          {showFilters && (
            <div className="w-[180px]">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="
                  h-[52px]
                  w-full
                  rounded-[22px]
                  border-[3px]
                  border-black
                  bg-[#f4f0ea]
                  px-4
                  text-lg
                  font-semibold
                "
              >
                <option>Date</option>
                <option>Status</option>
                <option>Name</option>
              </select>
            </div>
          )}

        </div>
      </div>
    }
    >
      <div
        className="
          min-h-[700px]
          rounded-b-[40px]
          bg-[#cad2c5]
          px-2
          py-4
        "
      >
        <div className="flex flex-col gap-5">

          <div
            className="
              flex
              items-center
              rounded-[22px]
              border-[4px]
              border-black
              bg-[#f4f0ea]
              px-6
              py-3
              font-semibold
            "
          >
            <div className="flex-1 text-xl">
              ACTION ITEM NAME
            </div>

            <div className="w-[260px] text-center text-xl">
              MEETING NAME
            </div>

            <div className="w-[150px] text-center text-xl">
              Date
            </div>

            <div className="w-[150px] text-center text-xl">
              Status
            </div>

            <div className="ml-3 w-10" />
          </div>

          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2"
            >
              <div
                className="
                  flex
                  items-center
                  rounded-[28px]
                  border-[4px]
                  border-black
                  bg-[#f4f0ea]
                  px-6
                  py-4
                "
              >
                <div className="flex flex-1 items-center gap-4">

                  <button
                    onClick={() =>
                      setSelectedItem(item)
                    }
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border-[3px]
                      border-black
                      text-lg
                      font-bold
                    "
                  >
                    ›
                  </button>

                  <p className="text-xl font-semibold uppercase">
                    {item.description}
                  </p>
                </div>

                <div className="w-[260px] text-center text-xl">
                  Meeting Name
                </div>

                <div className="w-[150px] text-center text-lg">
                  {item.deadline}
                </div>

                <div className="w-[150px] text-center text-lg">
                  {item.status}
                </div>

                <button
                  onClick={() =>
                    setSelectedItem(item)
                  }
                  className="
                    ml-3
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border-[3px]
                    border-[#3f6f44]
                    text-xl
                    font-bold
                    text-[#3f6f44]
                  "
                >
                  i
                </button>
              </div>
            </div>
          ))}

          {selectedItem ? (
            <ActionItemPopup
              item={selectedItem}
              isOpen={true}
              onClose={() =>
                setSelectedItem(null)
              }
              onDelete={handleDelete}
              onSave={handleSave}
            />
          ) : null}

        </div>
      </div>
    </MeetingLayoutTemplate>
  );
};

export default ToDoListTemplate; */