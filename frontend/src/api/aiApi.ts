const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
const normalizedApiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;

export const triggerAiProcessing = async (meetingId: number): Promise<string> => {
  const response = await fetch(`${normalizedApiBaseUrl}/api/ai/process/meeting/${meetingId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to initiate AI processing.');
  }

  return response.text();
};