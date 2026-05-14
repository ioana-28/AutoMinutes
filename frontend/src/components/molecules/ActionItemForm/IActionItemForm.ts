import { IActionItem } from '@/hooks/useActionItems';

export interface ActionItemFormProps {
  item: IActionItem;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  onChange: (updatedItem: IActionItem) => void;
  isNew?: boolean;
}
