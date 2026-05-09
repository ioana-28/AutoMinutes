export interface MeetingApiResponse {
  id: number;
  title?: string | null;
  description?: string | null;
  aiStatus?: string | null;
  createdAt?: string | null;
  meetingDate?: string | null;
  date?: string | null;
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

export const createMeeting = async (title: string, createdByUserId: number) => {
  const response = await fetch(meetingsEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      createdByUserId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
};

export const createMeetingWithTranscript = async (title: string, userId: number, file: File) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('userId', String(userId));
  formData.append('file', file);

  const response = await fetch(meetingsWithTranscriptEndpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
};
