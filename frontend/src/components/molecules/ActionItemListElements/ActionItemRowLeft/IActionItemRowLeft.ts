import { IActionItem } from '@/hooks/useActionItems';

export interface ActionItemRowLeftProps {
  item: IActionItem;
  isPanel: boolean;
  editingItem: IActionItem | null;
  onEditingItemChange: (item: IActionItem) => void;
  onSaveItem: (item: IActionItem) => void;
}