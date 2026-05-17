import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteMeeting,
  getMeeting,
  MeetingApiResponse,
  updateMeetingDate,
  updateMeetingTitle,
} from '@/api/meetingApi';

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
  refresh: () => Promise<void>;
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

  const meetingTitle = useMemo(() => meeting?.title?.trim() || 'Meeting', [meeting]);

  const fetchMeeting = useCallback(
    async (signal?: AbortSignal) => {
      if (meetingId === null) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getMeeting(meetingId, signal);
        setMeeting(data);
        setDraftTitle(data.title?.trim() || '');
        setDraftDate(data.meetingDate ?? '');
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError('Unable to load meeting.');
      } finally {
        setIsLoading(false);
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
    void fetchMeeting(controller.signal);

    return () => controller.abort();
  }, [fetchMeeting, meetingId]);

  const toggleEditTitle = useCallback(() => {
    setIsEditingTitle((prev) => !prev);
  }, []);

  const onSave = useCallback(async () => {
    if (!meeting) {
      return;
    }

    const nextTitle = draftTitle.trim();
    if (!nextTitle) {
      setError('Meeting title is required.');
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
      setError('Unable to save meeting changes.');
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
      setDeleteError('Unable to delete meeting.');
    } finally {
      setIsSaving(false);
    }
  }, [meeting, options]);

  const refresh = useCallback(async () => {
    await fetchMeeting();
  }, [fetchMeeting]);

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
  };
};

export default useMeetingDetails;
