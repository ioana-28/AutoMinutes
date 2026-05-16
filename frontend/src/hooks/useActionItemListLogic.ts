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
  const [editingItem, setEditingItem] = useState<IActionItem | null>(null);
  const [addItem, setAddItem] = useState<IActionItem | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [idPendingDelete, setIdPendingDelete] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Search, Filter, Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortKey, setSortKey] = useState('deadline-asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const createEmptyItem = (): IActionItem => ({
    id: 0,
    description: '',
    deadline: '',
    status: 'Pending',
  });

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter((item) => item.description.toLowerCase().includes(query));
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
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStartAdd = () => {
    setAddItem(createEmptyItem());
    setAddError(null);
  };

  const handleCancelAdd = () => {
    setAddItem(null);
    setAddError(null);
  };

  const handleSaveAdd = async () => {
    if (!addItem) return;

    if (!addItem.description.trim()) {
      setAddError('Please add a description for the action item.');
      return;
    }

    try {
      setAddError(null);
      await onSave(addItem);
      handleCancelAdd();
    } catch {
      // Error handled by hook
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
    } catch {
      setDeleteError('Unable to remove action item.');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      await onSave(editingItem);
      setEditingItem(null);
      setExpandedId(null);
    } catch {
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
      isAdding: addItem !== null,
      addItem,
      addError,
      isSaving: savingId === 0,
      onStartAdd: handleStartAdd,
      onCancelAdd: handleCancelAdd,
      onAddItemChange: setAddItem,
      onSaveAdd: handleSaveAdd,
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
