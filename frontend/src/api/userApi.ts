export interface UserApiResponse {
  id: number;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  activityStatus?: 'ACTIVE' | 'INACTIVE' | null;
}

export interface MeetingParticipantApiResponse {
  id: number;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  activityStatus?: 'ACTIVE' | 'INACTIVE' | null;
}

export interface UpdateMeetingParticipantRequest {
  firstName: string;
  lastName: string;
  activityStatus: 'ACTIVE' | 'INACTIVE';
}

export interface AuthUserRequest {
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: 'USER' | 'ADMIN' | null;
  activityStatus?: 'ACTIVE' | 'INACTIVE' | null;
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
const normalizedApiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
const meetingsEndpoint = `${normalizedApiBaseUrl}/api/meetings`;
const usersEndpoint = `${normalizedApiBaseUrl}/api/users`;

export const getUserById = async (
  userId: number,
  signal?: AbortSignal,
): Promise<UserApiResponse> => {
  const response = await fetch(`${usersEndpoint}/${userId}`, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as UserApiResponse;
};

export const loginUser = async (payload: AuthUserRequest): Promise<UserApiResponse> => {
  const response = await fetch(`${usersEndpoint}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as UserApiResponse;
};

export const createUser = async (payload: AuthUserRequest): Promise<UserApiResponse> => {
  const response = await fetch(`${usersEndpoint}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as UserApiResponse;
};

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

export const getMeetingParticipants = async (
  meetingId: number,
  signal?: AbortSignal,
): Promise<MeetingParticipantApiResponse[]> => {
  const response = await fetch(`${meetingsEndpoint}/${meetingId}/participants`, {
    signal,
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const data = (await response.json()) as MeetingParticipantApiResponse[];
  return Array.isArray(data) ? data : [];
};

export const addMeetingParticipant = async (meetingId: number, userId: number): Promise<void> => {
  const response = await fetch(`${meetingsEndpoint}/${meetingId}/participants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
};

export const deleteMeetingParticipant = async (meetingId: number, userId: number) => {
  const response = await fetch(`${meetingsEndpoint}/${meetingId}/participants/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
};

export const updateMeetingParticipant = async (
  meetingId: number,
  userId: number,
  payload: UpdateMeetingParticipantRequest,
): Promise<MeetingParticipantApiResponse> => {
  const response = await fetch(`${meetingsEndpoint}/${meetingId}/participants/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as MeetingParticipantApiResponse;
};
