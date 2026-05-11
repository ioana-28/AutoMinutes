export interface UserApiResponse {
  id: number;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  activityStatus?: 'ACTIVE' | 'INACTIVE' | null;
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
const normalizedApiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
const usersEndpoint = `${normalizedApiBaseUrl}/api/users`;

export const getUsers = async (signal?: AbortSignal): Promise<UserApiResponse[]> => {
  const response = await fetch(usersEndpoint, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = (await response.json()) as UserApiResponse[];
  return Array.isArray(data) ? data : [];
};

export const updateUserStatus = async (
  userId: number,
  active: boolean,
): Promise<UserApiResponse> => {
  const response = await fetch(`${usersEndpoint}/${userId}/status?active=${active}`, {
    method: 'PUT',
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as UserApiResponse;
};
