import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getMeetings,
  createMeeting,
  createMeetingWithTranscript,
  MeetingApiResponse,
} from '@/api/meetingApi';

export type MeetingStatus = 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'UNKNOWN';

export interface MeetingListItem {
  id: number;
  title: string;
  description: string;
  dateLabel: string;
  dateValue: number | null;
  status: MeetingStatus;
}

const normalizeStatus = (status?: string | null): MeetingStatus => {
  const normalized = status?.toUpperCase();
  if (
    normalized === 'IDLE' ||
    normalized === 'PROCESSING' ||
    normalized === 'COMPLETED' ||
    normalized === 'FAILED'
  ) {
    return normalized;
  }
  return 'UNKNOWN';
};

const formatMeetingDate = (meeting: MeetingApiResponse) => {
  const rawDate = meeting.createdAt ?? meeting.meetingDate ?? meeting.date;
  if (!rawDate) {
    return { label: 'No date', value: null };
  }
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) {
    return { label: 'No date', value: null };
  }
  return {
    label: parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    value: parsed.getTime(),
  };
};

export const useMeetings = (userId: number | null) => {
  const [meetings, setMeetings] = useState<MeetingApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [createMeetingError, setCreateMeetingError] = useState<string | null>(null);

  const fetchMeetings = useCallback(
    async (signal?: AbortSignal) => {
      if (userId === null) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getMeetings(userId, signal);
        setMeetings(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError('Unable to load meetings right now.');
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    if (userId === null) {
      return;
    }
    const controller = new AbortController();

    void fetchMeetings(controller.signal);

    return () => controller.abort();
  }, [fetchMeetings, userId]);

  const items = useMemo<MeetingListItem[]>(
    () =>
      meetings.map((meeting) => {
        const { label, value } = formatMeetingDate(meeting);

        return {
          id: meeting.id,
          title: meeting.title?.trim() || 'Untitled meeting',
          description: meeting.description?.trim() || '',
          dateLabel: label,
          dateValue: value,
          status: normalizeStatus(meeting.aiStatus),
        };
      }),
    [meetings],
  );

  const handleCreateMeeting = async (
    title: string,
    file: File | null,
    meetingDate: string | null,
  ) => {
    try {
      setIsCreatingMeeting(true);
      setCreateMeetingError(null);

      if (userId === null) {
        setCreateMeetingError('Unable to create a meeting without a user id.');
        return;
      }

      if (file) {
        await createMeetingWithTranscript(title, userId, file, meetingDate);
      } else {
        await createMeeting(title, userId, meetingDate);
      }

      await fetchMeetings();
    } catch (error) {
      setCreateMeetingError('Unable to create meeting right now.');
      throw error;
    } finally {
      setIsCreatingMeeting(false);
    }
  };

  const refreshMeetings = useCallback(async () => {
    await fetchMeetings();
  }, [fetchMeetings]);

  return {
    items,
    isLoading,
    error,
    isCreatingMeeting,
    createMeetingError,
    handleCreateMeeting,
    refreshMeetings,
  };
};
