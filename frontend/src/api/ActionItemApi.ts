const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/action-items`;

export async function getAllActionItems() {
  const response = await fetch(BASE_URL);
  return response.json();
}

export async function getActionItemById(id: number) {
  const response = await fetch(`${BASE_URL}/${id}`);
  return response.json();
}

export async function createActionItem(data: any, meetingId: number) {
  const response = await fetch(`${BASE_URL}?meetingId=${meetingId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function updateActionItem(id: number, data: any) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update action item');
  }

  return response.json();
}

export async function deleteActionItem(id: number) {
   const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/action-items/${id}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete action item');
  }
}