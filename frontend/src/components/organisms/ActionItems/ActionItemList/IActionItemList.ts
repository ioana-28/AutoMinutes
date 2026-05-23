import { IActionItem } from '@/hooks/useActionItems';

export interface IActionItemListProps {
  variant?: 'default' | 'panel';
  items: IActionItem[];
  isLoading: boolean;
  error: string | null;
  addControls: {
    isAdding: boolean;
    addItem: Partial<IActionItem> | null;
    isSaving: boolean;
    addError: string | null;
    onAddItemChange: (item: Partial<IActionItem>) => void;
    onSaveAdd: () => void;
    onCancelAdd: () => void;
  };
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
  editingItem: IActionItem | null;
  onEditingItemChange: (item: IActionItem) => void;
  onSave: () => void;
  onSaveItem: (item: IActionItem) => Promise<void>;
  onCancelEdit: () => void;
  onRequestDelete: (id: number) => void;
  savingId?: number | null;
}