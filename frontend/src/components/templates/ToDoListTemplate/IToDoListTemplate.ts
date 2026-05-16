import { ReactNode } from 'react';
import { IActionItem } from '@/hooks/useActionItems';
import { IActionItemListToolbarProps } from '@organisms/ActionItems/ActionItemListToolbar/IActionItemListToolbar';
import { IBaseConfirmationDialogProps } from '@molecules/ConfirmationDialog/IConfirmationDialog';

export interface IToDoListTemplateProps {
  activePage: 'meeting-list' | 'to-do-list' | 'admin';
  items: IActionItem[];
  isLoading: boolean;
  error: string | null;
  deletingId: number | null;
  savingId: number | null;
  addMeetingSlot?: ReactNode;
  onLogout?: () => void;
  toolbarProps: IActionItemListToolbarProps;
  listProps: {
    expandedId: number | null;
    onToggleExpand: (id: number) => void;
    editingItem: IActionItem | null;
    setEditingItem: (item: IActionItem) => void;
    onSave: () => Promise<void>;
    onCancelEdit: () => void;
    onRequestDelete: (id: number) => void;
  };
  addControls: {
    isAdding: boolean;
    addItem: IActionItem | null;
    addError: string | null;
    isSaving: boolean;
    onStartAdd: () => void;
    onCancelAdd: () => void;
    onAddItemChange: (item: IActionItem) => void;
    onSaveAdd: () => Promise<void>;
  };
  deleteDialogProps: IBaseConfirmationDialogProps;
}
