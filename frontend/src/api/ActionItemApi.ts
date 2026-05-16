import type { IActionItem } from '@/hooks/useActionItems';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/action-items`;

export async function getAllActionItems() {
  const response = await fetch(BASE_URL);
  return response.json();
}

export async function getActionItemsByMeetingId(meetingId: number) {
  const response = await fetch(`${BASE_URL}?meetingId=${meetingId}`);
  return response.json();
}

export async function getActionItemById(id: number) {
  const response = await fetch(`${BASE_URL}/${id}`);
  return response.json();
}

export async function createActionItem(data: IActionItem, meetingId: number): Promise<IActionItem> {
  const response = await fetch(`${BASE_URL}?meetingId=${meetingId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json() as Promise<IActionItem>;
}

export async function updateActionItem(id: number, data: IActionItem): Promise<IActionItem> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update action item');
  }

  return response.json() as Promise<IActionItem>;
}

export async function deleteActionItem(id: number) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const text = await response.text();

    console.error('DELETE ERROR:', text);

    throw new Error('Failed to delete action item');
  }
}
