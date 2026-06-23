import { authFetch } from '@/api/apiClient';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
const normalizedApiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;

export type AiProcessingTarget = 'participants' | 'action_items' | 'summary';

export const triggerAiProcessing = async (
  meetingId: number,
  target?: AiProcessingTarget,
): Promise<string> => {
  const query = target ? `?target=${encodeURIComponent(target)}` : '';
  const response = await authFetch(
    `${normalizedApiBaseUrl}/api/ai/process/meeting/${meetingId}${query}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to initiate AI processing.');
  }

  return response.text();
};