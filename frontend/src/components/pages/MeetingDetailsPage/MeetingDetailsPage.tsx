import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '@atoms/Popup/Popup';
import Button from '@atoms/Button/Button';
import MeetingDetailsTemplate from '@templates/MeetingDetailsTemplate/MeetingDetailsTemplate';
import {
  deleteMeeting,
  getMeeting,
  MeetingApiResponse,
  updateMeetingDate,
  updateMeetingTitle,
} from '@/api/meetingApi';

const MeetingDetailsPage: FC = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const resolvedId = Number(meetingId);
  const isInvalidId = Number.isNaN(resolvedId);

  const [meeting, setMeeting] = useState<MeetingApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDate, setDraftDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
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
    if (isInvalidId) {
      return;
    }

    const controller = new AbortController();

    const fetchMeeting = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMeeting(resolvedId, controller.signal);
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
    };

    fetchMeeting();

    return () => controller.abort();
  }, [resolvedId, isInvalidId]);

  const handleSave = async () => {
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
      setMeeting({
        ...meeting,
        title: nextTitle,
        meetingDate: nextDate || meeting.meetingDate,
      });
      setIsEditingTitle(false);
    } catch {
      setError('Unable to save meeting changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!meeting) {
      return;
    }

    try {
      setIsSaving(true);
      setDeleteError(null);
      await deleteMeeting(meeting.id);
      navigate('/meeting-list');
    } catch {
      setDeleteError('Unable to delete meeting.');
    } finally {
      setIsSaving(false);
      setIsDeleteOpen(false);
    }
  };

  if (isLoading) {
    return (
      <MeetingDetailsTemplate
        meetingTitle="Loading..."
        meetingDateLabel=""
        isEditingTitle={false}
        editTitleValue=""
        editDateValue=""
        onEditTitleValueChange={() => undefined}
        onEditDateValueChange={() => undefined}
        onToggleEditTitle={() => undefined}
        onSave={() => undefined}
        onDelete={() => undefined}
        onClose={() => navigate('/meeting-list')}
      >
        <div className="rounded-2xl border border-dashed border-[#7f9d86] bg-[#efebe2] p-10 text-center text-[#1f2937]">
          Loading meeting...
        </div>
      </MeetingDetailsTemplate>
    );
  }

  if (isInvalidId) {
    return (
      <MeetingDetailsTemplate
        meetingTitle="Meeting"
        meetingDateLabel=""
        isEditingTitle={false}
        editTitleValue=""
        editDateValue=""
        onEditTitleValueChange={() => undefined}
        onEditDateValueChange={() => undefined}
        onToggleEditTitle={() => undefined}
        onSave={() => undefined}
        onDelete={() => undefined}
        onClose={() => navigate('/meeting-list')}
      >
        <div className="rounded-2xl border border-[#b33a3a] bg-[#f4c7c7] p-6 text-center text-[#6b1f1f]">
          Invalid meeting id.
        </div>
      </MeetingDetailsTemplate>
    );
  }

  if (error) {
    return (
      <MeetingDetailsTemplate
        meetingTitle="Meeting"
        meetingDateLabel=""
        isEditingTitle={false}
        editTitleValue=""
        editDateValue=""
        onEditTitleValueChange={() => undefined}
        onEditDateValueChange={() => undefined}
        onToggleEditTitle={() => undefined}
        onSave={() => undefined}
        onDelete={() => undefined}
        onClose={() => navigate('/meeting-list')}
      >
        <div className="rounded-2xl border border-[#b33a3a] bg-[#f4c7c7] p-6 text-center text-[#6b1f1f]">
          {error}
        </div>
      </MeetingDetailsTemplate>
    );
  }

  return (
    <MeetingDetailsTemplate
      meetingTitle={meetingTitle}
      meetingDateLabel={meetingDateLabel}
      isEditingTitle={isEditingTitle}
      editTitleValue={draftTitle}
      editDateValue={draftDate}
      isSaving={isSaving}
      onEditTitleValueChange={setDraftTitle}
      onEditDateValueChange={setDraftDate}
      onToggleEditTitle={() => setIsEditingTitle((prev) => !prev)}
      onSave={handleSave}
      onDelete={() => setIsDeleteOpen(true)}
      onClose={() => navigate('/meeting-list')}
    >
      <div className="rounded-2xl border border-dashed border-[#7f9d86] bg-[#efebe2] p-10 text-center text-[#1f2937]">
        Meeting content goes here.
      </div>

      <Popup isOpen={isDeleteOpen} titleId="delete-meeting-title" variant="confirm">
        <h2 id="delete-meeting-title">Delete meeting</h2>
        <p>Are you sure you want to delete this meeting?</p>

        {deleteError ? <div data-popup-error>{deleteError}</div> : null}

        <div data-popup-actions>
          <Button label="Cancel" variant="nav" onClick={() => setIsDeleteOpen(false)} />
          <Button
            label={isSaving ? 'Deleting...' : 'Delete'}
            variant="nav"
            onClick={handleDelete}
            data-popup-danger
            disabled={isSaving}
          />
        </div>
      </Popup>
    </MeetingDetailsTemplate>
  );
};

export default MeetingDetailsPage;
