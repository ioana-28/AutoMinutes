import { useCallback, useEffect, useState } from 'react';
import {
  getAllActionItems,
  getActionItemsByMeetingId,
  createActionItem,
  updateActionItem,
  deleteActionItem,
} from '@/api/ActionItemApi';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

export type ActionItemStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export const normalizeActionItemStatus = (status?: string | null): ActionItemStatus => {
  const normalized = status?.toUpperCase();
  if (normalized === 'OPEN' || normalized === 'IN_PROGRESS' || normalized === 'DONE') {
    return normalized;
  }
  return 'OPEN';
};

export interface IActionItem {
  id: number;
  description: string;
  assignee?: string | null;
  assigneeUserId?: number | null;
  deadline?: string | null;
  status: ActionItemStatus;
  previousStatus?: ActionItemStatus | null;
  assigneeConfidence?: number | null;
  deadlineConfidence?: number | null;
  statusConfidence?: number | null;
}

export const useActionItems = (meetingId?: number | null) => {
  const [items, setItems] = useState<IActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  const loadActionItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      let data;
      if (meetingId) {
        data = await getActionItemsByMeetingId(meetingId);
      } else {
        data = await getAllActionItems();
      }
      setItems(data);
    } catch (err) {
      console.error(err);
      setError(ERROR_MESSAGES.ACTION_ITEMS_LOAD_FAILED);
    } finally {
      setIsLoading(false);
    }
  }, [meetingId]);

  useEffect(() => {
    void Promise.resolve().then(() => {
      void loadActionItems();
    });
  }, [loadActionItems]);

  const handleSaveActionItem = async (payload: IActionItem, currentMeetingId?: number) => {
    try {
      setSavingId(payload.id);
      let updated;
      if (payload.id === 0) {
        updated = await createActionItem(payload, currentMeetingId ?? meetingId ?? 0);
      } else {
        updated = await updateActionItem(payload.id, payload);
      }
      await loadActionItems();
      setEditingId(null);
      return updated;
    } catch (err) {
      console.error(err);
      setError(ERROR_MESSAGES.ACTION_ITEM_SAVE_FAILED);
      throw err;
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteActionItem = async (id: number) => {
    try {
      setDeletingId(id);
      await deleteActionItem(id);
      await loadActionItems();
    } catch (err) {
      console.error(err);
      setError(ERROR_MESSAGES.ACTION_ITEM_DELETE_FAILED);
      throw err;
    } finally {
      setDeletingId(null);
    }
  };

  return {
    items,
    isLoading,
    error,
    deletingId,
    editingId,
    savingId,
    setEditingId,
    loadActionItems,
    handleSaveActionItem,
    handleDeleteActionItem,
  };
};
