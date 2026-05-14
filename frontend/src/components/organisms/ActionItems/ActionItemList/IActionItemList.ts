import { IActionItem } from '@/hooks/useActionItems';

export interface IActionItemListProps {
  items: IActionItem[];
  isLoading: boolean;
  error: string | null;
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
  editingItem: IActionItem | null;
  onEditingItemChange: (item: IActionItem) => void;
  onSave: () => Promise<void>;
  onCancelEdit: () => void;
  onRequestDelete: (id: number) => void;
  savingId: number | null;
}
