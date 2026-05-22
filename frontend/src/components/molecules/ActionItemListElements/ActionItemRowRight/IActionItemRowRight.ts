import { IActionItem, ActionItemStatus } from '@/hooks/useActionItems';

export interface ActionItemRowRightProps {
  item: IActionItem;
  isPanel: boolean;
  editingItem: IActionItem | null;
  onEditingItemChange: (item: IActionItem) => void;
  onRequestDelete: (id: number) => void;
  onSave: () => void;
  onCancelEdit: () => void;
  lowConfidence: boolean;
  statusOptions: { value: ActionItemStatus; label: string }[];
  getStatusLabel: (status: ActionItemStatus) => string;
  getActionItemStatusPillClasses: (status: string) => string;
}