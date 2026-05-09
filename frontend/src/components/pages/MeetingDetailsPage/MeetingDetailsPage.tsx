import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '@atoms/Popup/Popup';
import Button from '@atoms/Button/Button';
import MeetingDetailsTemplate from '@templates/MeetingDetailsTemplate/MeetingDetailsTemplate';
import {
  deleteMeeting,
  getMeeting,
  MeetingApiResponse,
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
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const meetingTitle = useMemo(() => meeting?.title?.trim() || 'Meeting', [meeting]);

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
    if (!meeting || !draftTitle.trim()) {
      return;
    }

    try {
      setIsSaving(true);
      await updateMeetingTitle(meeting.id, draftTitle.trim());
      setMeeting({ ...meeting, title: draftTitle.trim() });
      setIsEditingTitle(false);
    } catch {
      setError('Unable to save meeting title.');
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
        isEditingTitle={false}
        editTitleValue=""
        onEditTitleValueChange={() => undefined}
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
        isEditingTitle={false}
        editTitleValue=""
        onEditTitleValueChange={() => undefined}
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
        isEditingTitle={false}
        editTitleValue=""
        onEditTitleValueChange={() => undefined}
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
      isEditingTitle={isEditingTitle}
      editTitleValue={draftTitle}
      isSaving={isSaving}
      onEditTitleValueChange={setDraftTitle}
      onToggleEditTitle={() => setIsEditingTitle((prev) => !prev)}
      onSave={handleSave}
      onDelete={() => setIsDeleteOpen(true)}
      onClose={() => navigate('/meeting-list')}
    >
      <div className="rounded-2xl border border-dashed border-[#7f9d86] bg-[#efebe2] p-10 text-center text-[#1f2937]">
        Meeting content goes here.
      </div>

      <Popup isOpen={isDeleteOpen} titleId="delete-meeting-title" variant="confirm">
        <header className="flex w-full items-center justify-between gap-3 bg-[#cad2c5] px-4 py-3">
          <h2 id="delete-meeting-title" className="m-0 text-lg font-bold text-black">
            Delete meeting
          </h2>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-5 mt-3">
          <p className="text-xl text-[#f1f5f9] font-semibold text-center ">
            Are you sure you want to delete this meeting?
          </p>

          {deleteError ? (
            <div className="rounded-lg border border-[#b33a3a] bg-[#f4c7c7] px-3 py-2 text-sm text-[#6b1f1f]">
              {deleteError}
            </div>
          ) : null}

          <div className="mt-auto flex flex-wrap justify-center gap-3">
            <Button label="Cancel" variant="nav" onClick={() => setIsDeleteOpen(false)} />
            <Button
              label={isSaving ? 'Deleting...' : 'Delete'}
              variant="nav"
              onClick={handleDelete}
              className="border-[#513030] bg-[#e0b7b7] text-[#2e1111] hover:bg-[#d8a9a9]"
              disabled={isSaving}
            />
          </div>
        </div>
      </Popup>
    </MeetingDetailsTemplate>
  );
};

export default MeetingDetailsPage;
