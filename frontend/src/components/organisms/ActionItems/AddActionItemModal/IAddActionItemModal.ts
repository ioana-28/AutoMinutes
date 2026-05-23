import { IActionItem } from '@/hooks/useActionItems';

export interface IAddActionItemModalProps {
  onSave: (payload: IActionItem) => Promise<void>;
  isSaving?: boolean;
  error?: string | null;
  triggerVariant?: 'nav' | 'add';
  triggerLabel?: string;
  onOpenChange?: (isOpen: boolean) => void;
}
