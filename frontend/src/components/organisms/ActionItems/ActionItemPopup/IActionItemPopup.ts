import { IActionItem } from '@/hooks/useActionItems';

export interface IActionItemPopupProps {
  isOpen: boolean;
  onClose: () => void;
  items: IActionItem[];
  isLoading: boolean;
  error: string | null;
  deletingId: number | null;
  savingId: number | null;
  onSave: (payload: IActionItem) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}
