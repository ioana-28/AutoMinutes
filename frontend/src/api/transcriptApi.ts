export interface TranscriptResponse {
  id: number;
  fileName: string;
  filePath: string;
  content?: string;
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
const normalizedApiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
const transcriptsEndpoint = `${normalizedApiBaseUrl}/api/transcripts`;

export const getTranscriptFile = async (meetingId: number): Promise<Blob> => {
  const response = await fetch(`${transcriptsEndpoint}/${meetingId}/file`);
  if (!response.ok) {
    throw new Error(`Failed to fetch document: ${response.status}`);
  }
  return await response.blob();
};

export const getTranscriptFileUrl = (meetingId: number): string =>
  `${transcriptsEndpoint}/${meetingId}/file`;

export const getTranscriptByMeetingId = async (
  meetingId: number,
  signal?: AbortSignal,
): Promise<TranscriptResponse | null> => {
  const response = await fetch(`${transcriptsEndpoint}/${meetingId}`, {
    signal,
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch transcript metadata: ${response.status}`);
  }
  const data = (await response.json()) as TranscriptResponse | null;
  return data && typeof data.id === 'number' ? data : null;
};
