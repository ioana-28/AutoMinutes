import { FC, useEffect, useState } from 'react';

import ToDoListTemplate from '@templates/ToDoListTemplate/ToDoListTemplate';

import {
  getAllActionItems,
  deleteActionItem,
  updateActionItem,
} from '../../../api/ActionItemApi';

const ToDoListPage: FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Date');
  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedItem, setSelectedItem] =
    useState<any | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const data = await getAllActionItems();

      setItems(data);
    } catch (error) {
      console.error(
        'Failed to fetch action items:',
        error
      );
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteActionItem(id);

      setItems((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );

      setSelectedItem(null);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSave(payload: any) {
    try {
      const updated =
        await updateActionItem(
          payload.id,
          payload
        );

      setItems((previous) =>
        previous.map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
      );

      setSelectedItem(updated);
    } catch (error) {
      console.error(error);
    }
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
    <ToDoListTemplate
      activePage="to-do-list"
      items={filteredItems}
      search={search}
      setSearch={setSearch}
      sortBy={sortBy}
      setSortBy={setSortBy}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
      handleDelete={handleDelete}
      handleSave={handleSave}
    />
  );
};

export default ToDoListPage;
