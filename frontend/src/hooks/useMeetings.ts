import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getMeetings,
  createMeetingWithTranscript,
  MeetingApiResponse,
} from '@/api/meetingApi';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

export type MeetingStatus = 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'UNKNOWN';

export interface MeetingListItem {
  id: number;
  title: string;
  description: string;
  actionItemsCount: number;
  attendeesCount: number;
  dateLabel: string;
  dateValue: number | null;
  status: MeetingStatus;
  transcriptContent?: string;
}

export const normalizeStatus = (status?: string | null): MeetingStatus => {
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
    async (signal?: AbortSignal, silent = false) => {
      if (userId === null) {
        return;
      }

      try {
        if (!silent) setIsLoading(true);
        setError(null);
        const data = await getMeetings(userId, signal);
        setMeetings(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError(ERROR_MESSAGES.MEETINGS_LOAD_FAILED);
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    if (userId === null) {
      return;
    }
    const controller = new AbortController();

    void Promise.resolve().then(() => {
      void fetchMeetings(controller.signal);
    });
    const timeoutId = window.setTimeout(() => {
      void fetchMeetings(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchMeetings, userId]);

  useEffect(() => {
    const hasProcessing = meetings.some((m) => m.aiStatus?.toUpperCase() === 'PROCESSING');

    if (userId === null || !hasProcessing) {
      return;
    }

    const interval = setInterval(() => {
      void fetchMeetings(undefined, true);
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchMeetings, meetings, userId]);

  const items = useMemo<MeetingListItem[]>(
    () =>
      meetings.map((meeting) => {
        const { label, value } = formatMeetingDate(meeting);

        return {
          id: meeting.id,
          title: meeting.title?.trim() || 'Untitled meeting',
          description: meeting.description?.trim() || '',
          actionItemsCount: meeting.actionItemsCount ?? 0,
          attendeesCount: meeting.participants?.length ?? 0,
          //description:meeting.description?.trim() ||'This meeting discusses pineapple analytics dashboard Safari authentication and investor planning.',
          transcriptContent: meeting.transcript?.content || '',
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
        const msg = ERROR_MESSAGES.MEETING_CREATE_NO_USER;
        setCreateMeetingError(msg);
        throw new Error(msg);
      }

      if (!file) {
        const msg = ERROR_MESSAGES.MEETING_TRANSCRIPT_REQUIRED;
        setCreateMeetingError(msg);
        throw new Error(msg);
      }

      await createMeetingWithTranscript(title, userId, file, meetingDate);

      await fetchMeetings();
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.MEETING_CREATE_FAILED;
      setCreateMeetingError(message);
      throw error;
    } finally {
      setIsCreatingMeeting(false);
    }
  };

  const refreshMeetings = useCallback(async () => {
    await fetchMeetings();
  }, [fetchMeetings]);

  const clearCreateMeetingError = useCallback(() => {
    setCreateMeetingError(null);
  }, []);

  return {
    items,
    isLoading,
    error,
    isCreatingMeeting,
    createMeetingError,
    handleCreateMeeting,
    refreshMeetings,
    clearCreateMeetingError,
  };
};
