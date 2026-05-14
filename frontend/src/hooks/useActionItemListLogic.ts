import { useMemo, useState } from 'react';
import { IActionItem } from '@/hooks/useActionItems';

interface ActionItemListLogicProps {
  items: IActionItem[];
  onDelete: (id: number) => Promise<void>;
  onSave: (payload: IActionItem) => Promise<void>;
  deletingId: number | null;
  savingId: number | null;
}

const useActionItemListLogic = ({
  items,
  onDelete,
  onSave,
  deletingId,
  savingId,
}: ActionItemListLogicProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<IActionItem | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [idPendingDelete, setIdPendingDelete] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Search, Filter, Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortKey, setSortKey] = useState('deadline-asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const emptyItem: IActionItem = {
    id: 0,
    description: '',
    deadline: '',
    status: 'Pending',
  };

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter((item) =>
        item.description.toLowerCase().includes(query)
      );
    }

    // Filter by Status
    if (statusFilter !== 'All') {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortKey) {
        case 'deadline-asc':
          return (a.deadline || '9999').localeCompare(b.deadline || '9999');
        case 'deadline-desc':
          return (b.deadline || '').localeCompare(a.deadline || '');
        case 'description-asc':
          return a.description.localeCompare(b.description);
        case 'description-desc':
          return b.description.localeCompare(a.description);
        default:
          return 0;
      }
    });

    return result;
  }, [items, searchTerm, statusFilter, sortKey]);

  const handleToggleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      setEditingItem(null);
    } else {
      setExpandedId(id);
      const item = items.find((i) => i.id === id);
      setEditingItem(item ? { ...item } : null);
    }
  };

  const handleOpenDeleteConfirm = (id: number) => {
    setIdPendingDelete(id);
    setDeleteError(null);
  };

  const handleCancelDelete = () => {
    setIdPendingDelete(null);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (idPendingDelete === null) return;

    try {
      setDeleteError(null);
      await onDelete(idPendingDelete);
      setIdPendingDelete(null);
      if (expandedId === idPendingDelete) {
        setExpandedId(null);
        setEditingItem(null);
      }
    } catch (error) {
      setDeleteError('Unable to remove action item.');
    }
  };

  const handleOpenAdd = () => {
    setIsAdding(true);
    setEditingItem({ ...emptyItem });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      await onSave(editingItem);
      setEditingItem(null);
      setExpandedId(null);
      setIsAdding(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  return {
    filteredItems,
    toolbarProps: {
      searchTerm,
      onSearchTermChange: setSearchTerm,
      sortKey,
      onSortKeyChange: setSortKey,
      isFilterOpen,
      onOpenFilter: () => setIsFilterOpen(true),
      onCloseFilter: () => setIsFilterOpen(false),
      statusFilter,
      onStatusFilterChange: setStatusFilter,
    },
    addControls: {
      isAdding,
      onOpenAdd: handleOpenAdd,
      onCancelAdd: handleCancelAdd,
    },
    listProps: {
      expandedId,
      onToggleExpand: handleToggleExpand,
      editingItem,
      setEditingItem,
      onSave: handleSaveEdit,
      onCancelEdit: () => {
        setExpandedId(null);
        setEditingItem(null);
      },
      onRequestDelete: handleOpenDeleteConfirm,
    },
    deleteDialogProps: {
      isOpen: idPendingDelete !== null,
      isSaving: idPendingDelete !== null && deletingId === idPendingDelete,
      error: deleteError,
      onCancel: handleCancelDelete,
      onConfirm: handleConfirmDelete,
    },
  };
};

export default useActionItemListLogic;
