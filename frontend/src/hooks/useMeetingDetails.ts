import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteMeeting,
  getMeeting,
  MeetingApiResponse,
  updateMeetingDate,
  updateMeetingTitle,
} from '@/api/meetingApi';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

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

    const fetchMeeting = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMeeting(meetingId, controller.signal);
        setMeeting(data);
        setDraftTitle(data.title?.trim() || '');
        setDraftDate(data.meetingDate ?? '');
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError(ERROR_MESSAGES.MEETING_LOAD_FAILED);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeeting();

    return () => controller.abort();
  }, [meetingId]);

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
  };
};

export default useMeetingDetails;
