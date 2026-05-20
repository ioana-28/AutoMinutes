import type { IActionItem } from '@/hooks/useActionItems';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
const normalizedApiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
const actionItemsEndpoint = `${normalizedApiBaseUrl}/api/action-items`;

export async function getAllActionItems() {
  const response = await fetch(actionItemsEndpoint);
  return response.json();
}

export async function getActionItemsByMeetingId(meetingId: number) {
  const response = await fetch(`${actionItemsEndpoint}?meetingId=${meetingId}`);
  return response.json();
}

export async function getActionItemById(id: number) {
  const response = await fetch(`${actionItemsEndpoint}/${id}`);
  return response.json();
}

export async function createActionItem(data: IActionItem, meetingId: number): Promise<IActionItem> {
  const { id: _, ...rest } = data;
  const sanitizedData = {
    ...rest,
    deadline: data.deadline || null,
    hasPersonAssigned: !!(data.assignee || data.assigneeUserId),
    hasDeadline: !!data.deadline,
  };

  const response = await fetch(`${actionItemsEndpoint}?meetingId=${meetingId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sanitizedData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('CREATE ACTION ITEM ERROR:', errorText);
    throw new Error(ERROR_MESSAGES.ACTION_ITEM_SAVE_FAILED);
  }

  return response.json() as Promise<IActionItem>;
}

export async function updateActionItem(id: number, data: IActionItem): Promise<IActionItem> {
  const sanitizedData = {
    ...data,
    deadline: data.deadline || null,
    hasPersonAssigned: !!(data.assignee || data.assigneeUserId),
    hasDeadline: !!data.deadline,
  };

  const response = await fetch(`${actionItemsEndpoint}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sanitizedData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('UPDATE ACTION ITEM ERROR:', errorText);
    throw new Error(ERROR_MESSAGES.ACTION_ITEM_UPDATE_FAILED);
  }

  return response.json() as Promise<IActionItem>;
}

export async function deleteActionItem(id: number) {
  const response = await fetch(`${actionItemsEndpoint}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const text = await response.text();

    console.error('DELETE ERROR:', text);

    throw new Error(ERROR_MESSAGES.ACTION_ITEM_DELETE_FAILED);
  }
}
