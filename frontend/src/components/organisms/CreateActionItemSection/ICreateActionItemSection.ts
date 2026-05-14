import { IActionItem } from '@/hooks/useActionItems';

export interface ICreateActionItemSectionProps {
  item: IActionItem;
  onSave: () => void;
  onCancel: () => void;
  onChange: (item: IActionItem) => void;
  isSaving?: boolean;
}
