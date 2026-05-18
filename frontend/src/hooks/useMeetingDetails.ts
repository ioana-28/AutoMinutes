import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteMeeting,
  getMeeting,
  MeetingApiResponse,
  updateMeetingDate,
  updateMeetingTitle,
} from '@/api/meetingApi';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { MeetingStatus } from '@/hooks/useMeetings';

type UseMeetingDetailsOptions = {
  onDeleted?: () => void;
  onUpdated?: (meeting: MeetingApiResponse) => void;
};

type MeetingDetailsHook = {
  meeting: MeetingApiResponse | null;
  meetingTitle: string;
  meetingDateLabel: string;
  draftTitle: string;
  draftDate: string;
  isEditingTitle: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  deleteError: string | null;
  setDraftTitle: (value: string) => void;
  setDraftDate: (value: string) => void;
  toggleEditTitle: () => void;
  onSave: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  refresh: (silent?: boolean) => Promise<void>;
  setStatusOptimistically: (status: MeetingStatus) => void;
};

const useMeetingDetails = (
  meetingId: number | null,
  options: UseMeetingDetailsOptions = {},
): MeetingDetailsHook => {
  const [meeting, setMeeting] = useState<MeetingApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDate, setDraftDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const meetingTitle = useMemo(() => meeting?.title?.trim() || 'Meeting', [meeting]);

  const fetchMeeting = useCallback(
    async (signal?: AbortSignal, silent = false) => {
      if (meetingId === null) {
        return;
      }

      try {
        if (!silent) setIsLoading(true);
        setError(null);
        const data = await getMeeting(meetingId, signal);
        setMeeting(data);
        setDraftTitle(data.title?.trim() || '');
        setDraftDate(data.meetingDate ?? '');

        const status = data.aiStatus?.toUpperCase();
        if (status === 'COMPLETED' || status === 'FAILED') {
          setIsPolling(false);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError('Unable to load meeting.');
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [meetingId],
  );

  const meetingDateLabel = useMemo(() => {
    if (!meeting?.meetingDate) {
      return 'No date';
    }
    const parsed = new Date(`${meeting.meetingDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return 'No date';
    }
    return parsed.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, [meeting]);

  useEffect(() => {
    if (meetingId === null) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void fetchMeeting(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchMeeting, meetingId]);

  useEffect(() => {
    const status = meeting?.aiStatus?.toUpperCase();
    const shouldPoll = isPolling || status === 'PROCESSING';

    if (meetingId === null || !shouldPoll) {
      return;
    }

    const interval = setInterval(() => {
      void fetchMeeting(undefined, true);
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchMeeting, isPolling, meeting?.aiStatus, meetingId]);

  const toggleEditTitle = useCallback(() => {
    setIsEditingTitle((prev) => !prev);
  }, []);

  const onSave = useCallback(async () => {
    if (!meeting) {
      return;
    }

    const nextTitle = draftTitle.trim();
    if (!nextTitle) {
      setError(ERROR_MESSAGES.MEETING_TITLE_REQUIRED);
      return;
    }

    const nextDate = draftDate.trim();
    const titleChanged = nextTitle !== (meeting.title?.trim() || '');
    const dateChanged = Boolean(nextDate && nextDate !== (meeting.meetingDate ?? ''));

    if (!titleChanged && !dateChanged) {
      setIsEditingTitle(false);
      return;
    }

    try {
      setIsSaving(true);
      if (titleChanged) {
        await updateMeetingTitle(meeting.id, nextTitle);
      }
      if (dateChanged) {
        await updateMeetingDate(meeting.id, nextDate);
      }
      const updatedMeeting = {
        ...meeting,
        title: nextTitle,
        meetingDate: nextDate || meeting.meetingDate,
      };
      setMeeting(updatedMeeting);
      setIsEditingTitle(false);
      options.onUpdated?.(updatedMeeting);
    } catch {
      setError(ERROR_MESSAGES.MEETING_SAVE_FAILED);
    } finally {
      setIsSaving(false);
    }
  }, [draftDate, draftTitle, meeting, options]);

  const onDelete = useCallback(async () => {
    if (!meeting) {
      return;
    }

    try {
      setIsSaving(true);
      setDeleteError(null);
      await deleteMeeting(meeting.id);
      options.onDeleted?.();
    } catch {
      setDeleteError(ERROR_MESSAGES.MEETING_DELETE_FAILED);
    } finally {
      setIsSaving(false);
    }
  }, [meeting, options]);

  const refresh = useCallback(
    async (silent = false) => {
      await fetchMeeting(undefined, silent);
    },
    [fetchMeeting],
  );

  const setStatusOptimistically = useCallback((status: MeetingStatus) => {
    setMeeting((prev) => (prev ? { ...prev, aiStatus: status } : null));
    if (status === 'PROCESSING') {
      setIsPolling(true);
    }
  }, []);

  return {
    meeting,
    meetingTitle,
    meetingDateLabel,
    draftTitle,
    draftDate,
    isEditingTitle,
    isLoading,
    isSaving,
    error,
    deleteError,
    setDraftTitle,
    setDraftDate,
    toggleEditTitle,
    onSave,
    onDelete,
    refresh,
    setStatusOptimistically,
  };
};

export default useMeetingDetails;
