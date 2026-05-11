export interface MeetingApiResponse {
  id: number;
  title?: string | null;
  description?: string | null;
  aiStatus?: string | null;
  createdAt?: string | null;
  meetingDate?: string | null;
  date?: string | null;
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

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
const normalizedApiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
const meetingsEndpoint = `${normalizedApiBaseUrl}/api/meetings`;
const meetingsWithTranscriptEndpoint = `${normalizedApiBaseUrl}/api/meetings/create-with-transcript`;

export const getMeetings = async (signal?: AbortSignal): Promise<MeetingApiResponse[]> => {
  const response = await fetch(meetingsEndpoint, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const data = (await response.json()) as MeetingApiResponse[];
  return Array.isArray(data) ? data : [];
};

export const getMeeting = async (
  meetingId: number,
  signal?: AbortSignal,
): Promise<MeetingApiResponse> => {
  const response = await fetch(`${meetingsEndpoint}/${meetingId}`, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as MeetingApiResponse;
};

export const getMeetingParticipants = async (
  meetingId: number,
  signal?: AbortSignal,
): Promise<MeetingParticipantApiResponse[]> => {
  const response = await fetch(`${meetingsEndpoint}/${meetingId}/participants`, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const data = (await response.json()) as MeetingParticipantApiResponse[];
  return Array.isArray(data) ? data : [];
};

export const createMeeting = async (
  title: string,
  createdByUserId: number,
  meetingDate: string | null,
) => {
  const response = await fetch(meetingsEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      createdByUserId,
      meetingDate,
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
};

export const createMeetingWithTranscript = async (
  title: string,
  userId: number,
  file: File,
  meetingDate: string | null,
) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('userId', String(userId));
  formData.append('file', file);
  if (meetingDate) {
    formData.append('meetingDate', meetingDate);
  }

  const response = await fetch(meetingsWithTranscriptEndpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
};

export const updateMeetingTitle = async (meetingId: number, title: string) => {
  const response = await fetch(`${meetingsEndpoint}/${meetingId}/title`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
};

export const updateMeetingDate = async (meetingId: number, meetingDate: string) => {
  const response = await fetch(`${meetingsEndpoint}/${meetingId}/date`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      meetingDate,
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
};

export const deleteMeeting = async (meetingId: number) => {
  const response = await fetch(`${meetingsEndpoint}/${meetingId}`, {
    method: 'DELETE',
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
