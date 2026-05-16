import { IActionItem } from '@/hooks/useActionItems';

export interface IActionItemListProps {
  variant?: 'default' | 'panel';
  items: IActionItem[];
  isLoading: boolean;
  error: string | null;
  addControls: {
    isAdding: boolean;
    addItem: IActionItem | null;
    addError: string | null;
    isSaving: boolean;
    onStartAdd: () => void;
    onCancelAdd: () => void;
    onAddItemChange: (item: IActionItem | null) => void;
    onSaveAdd: () => Promise<void>;
  };
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
  editingItem: IActionItem | null;
  onEditingItemChange: (item: IActionItem) => void;
  onSave: () => Promise<void>;
  onCancelEdit: () => void;
  onRequestDelete: (id: number) => void;
  savingId: number | null;
}
