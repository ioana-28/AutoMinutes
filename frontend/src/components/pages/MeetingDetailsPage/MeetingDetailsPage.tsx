import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StateMessage from '@atoms/StateMessage/StateMessage';
import AttendeesListPopup from '@organisms/AttendeesListPopup/AttendeesListPopup';
import MeetingDeleteDialog from '@organisms/MeetingDeleteDialog/MeetingDeleteDialog';
import MeetingDetailsTemplate from '@templates/MeetingDetailsTemplate/MeetingDetailsTemplate';
import {
  addMeetingParticipant,
  deleteMeetingParticipant,
  deleteMeeting,
  getMeeting,
  getMeetingParticipants,
  MeetingApiResponse,
  MeetingParticipantApiResponse,
  updateMeetingDate,
  updateMeetingParticipant,
  updateMeetingTitle,
} from '@/api/meetingApi';
import { getUsers, UserApiResponse } from '@/api/userApi';

const MeetingDetailsPage: FC = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const resolvedId = Number(meetingId);
  const isInvalidId = Number.isNaN(resolvedId);

  const [meeting, setMeeting] = useState<MeetingApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [participants, setParticipants] = useState<MeetingParticipantApiResponse[]>([]);
  const [isParticipantsLoading, setIsParticipantsLoading] = useState(false);
  const [participantsError, setParticipantsError] = useState<string | null>(null);
  const [deletingParticipantId, setDeletingParticipantId] = useState<number | null>(null);
  const [editingParticipantId, setEditingParticipantId] = useState<number | null>(null);
  const [editParticipantNameValue, setEditParticipantNameValue] = useState('');
  const [savingParticipantId, setSavingParticipantId] = useState<number | null>(null);
  const [availableUsers, setAvailableUsers] = useState<UserApiResponse[]>([]);
  const [isAvailableUsersLoading, setIsAvailableUsersLoading] = useState(false);
  const [availableUsersError, setAvailableUsersError] = useState<string | null>(null);
  const [addingParticipantUserId, setAddingParticipantUserId] = useState<number | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDate, setDraftDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const deleteDialogOpenRef = useRef<() => void>(() => undefined);

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

  useEffect(() => {
    if (!isParticipantsOpen || !meeting) {
      return;
    }

    const controller = new AbortController();

    const fetchParticipants = async () => {
      try {
        setIsParticipantsLoading(true);
        setParticipantsError(null);
        const data = await getMeetingParticipants(meeting.id, controller.signal);
        setParticipants(data);
        setEditingParticipantId(null);
        setEditParticipantNameValue('');
        setSavingParticipantId(null);
        setAddingParticipantUserId(null);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setParticipantsError('Unable to load participants.');
      } finally {
        setIsParticipantsLoading(false);
      }
    };

    fetchParticipants();

    return () => controller.abort();
  }, [isParticipantsOpen, meeting]);

  useEffect(() => {
    if (!isParticipantsOpen) {
      return;
    }

    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setIsAvailableUsersLoading(true);
        setAvailableUsersError(null);
        const data = await getUsers(controller.signal);
        setAvailableUsers(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setAvailableUsersError('Unable to load users.');
      } finally {
        setIsAvailableUsersLoading(false);
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, [isParticipantsOpen]);

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
    }
  };

  const handleDeleteParticipant = async (userId: number) => {
    if (!meeting) {
      return;
    }

    try {
      setDeletingParticipantId(userId);
      setParticipantsError(null);
      await deleteMeetingParticipant(meeting.id, userId);
      setParticipants((currentParticipants) =>
        currentParticipants.filter((participant) => participant.id !== userId),
      );
      if (editingParticipantId === userId) {
        setEditingParticipantId(null);
        setEditParticipantNameValue('');
      }
    } catch {
      const errorMessage = 'Unable to remove participant.';
      setParticipantsError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeletingParticipantId(null);
    }
  };

  const handleStartEditParticipant = (userId: number, currentName: string) => {
    setParticipantsError(null);
    setEditingParticipantId(userId);
    setEditParticipantNameValue(currentName);
  };

  const handleCancelEditParticipant = () => {
    setEditingParticipantId(null);
    setEditParticipantNameValue('');
  };

  const handleSaveEditParticipant = async (userId: number) => {
    if (!meeting || editingParticipantId !== userId) {
      return;
    }

    const participant = participants.find((item) => item.id === userId);
    if (!participant) {
      return;
    }

    const fullName = editParticipantNameValue.trim();
    if (!fullName) {
      setParticipantsError('Participant name is required.');
      return;
    }

    const fullNameParts = fullName.split(/\s+/);
    const firstName = fullNameParts[0] ?? '';
    const lastName = fullNameParts.slice(1).join(' ');
    const activityStatus = participant.activityStatus === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      setSavingParticipantId(userId);
      setParticipantsError(null);
      const updatedParticipant = await updateMeetingParticipant(meeting.id, userId, {
        firstName,
        lastName,
        activityStatus,
      });

      setParticipants((currentParticipants) =>
        currentParticipants.map((currentParticipant) =>
          currentParticipant.id === userId
            ? {
                ...currentParticipant,
                ...updatedParticipant,
                firstName: updatedParticipant.firstName ?? firstName,
                lastName: updatedParticipant.lastName ?? lastName,
                activityStatus: updatedParticipant.activityStatus ?? activityStatus,
              }
            : currentParticipant,
        ),
      );
      setEditingParticipantId(null);
      setEditParticipantNameValue('');
    } catch {
      setParticipantsError('Unable to update participant.');
    } finally {
      setSavingParticipantId(null);
    }
  };

  const handleAddParticipant = async (userId: number) => {
    if (!meeting) {
      return;
    }

    if (participants.some((participant) => participant.id === userId)) {
      setParticipantsError('Participant is already in this meeting.');
      throw new Error('Participant is already in this meeting.');
    }

    try {
      setAddingParticipantUserId(userId);
      setParticipantsError(null);
      await addMeetingParticipant(meeting.id, userId);
      const refreshedParticipants = await getMeetingParticipants(meeting.id);
      const deduplicatedParticipants = Array.from(
        new Map(refreshedParticipants.map((participant) => [participant.id, participant])).values(),
      );
      setParticipants(deduplicatedParticipants);
    } catch (err) {
      setParticipantsError('Unable to add participant.');
      throw err;
    } finally {
      setAddingParticipantUserId(null);
    }
  };

  const canEdit = Boolean(meeting) && !isLoading && !isInvalidId && !error;
  const displayTitle = isLoading ? 'Loading...' : meetingTitle;
  const displayDateLabel = canEdit ? meetingDateLabel : '';
  const displayIsEditing = canEdit ? isEditingTitle : false;

  const registerDeleteOpen = useCallback((open: () => void) => {
    deleteDialogOpenRef.current = open;
  }, []);

  const handleOpenDelete = () => {
    if (!meeting) {
      return;
    }
    deleteDialogOpenRef.current();
  };

  const content = isLoading ? (
    <StateMessage variant="loading" message="Loading meeting..." />
  ) : isInvalidId ? (
    <StateMessage variant="error" message="Invalid meeting id." />
  ) : error ? (
    <StateMessage variant="error" message={error} />
  ) : null;

  return (
    <MeetingDetailsTemplate
      meetingTitle={displayTitle}
      meetingDateLabel={displayDateLabel}
      isEditingTitle={displayIsEditing}
      editTitleValue={canEdit ? draftTitle : ''}
      editDateValue={canEdit ? draftDate : ''}
      isSaving={isSaving}
      onEditTitleValueChange={canEdit ? setDraftTitle : () => undefined}
      onEditDateValueChange={canEdit ? setDraftDate : () => undefined}
      onToggleEditTitle={canEdit ? () => setIsEditingTitle((prev) => !prev) : () => undefined}
      onSave={canEdit ? handleSave : () => undefined}
      onDelete={canEdit ? handleOpenDelete : () => undefined}
      onClose={() => navigate('/meeting-list')}
      onParticipants={() => setIsParticipantsOpen(true)}
      onActionItems={() => undefined}
    >
      {content}
      <AttendeesListPopup
        isOpen={isParticipantsOpen}
        onClose={() => setIsParticipantsOpen(false)}
        participants={participants}
        isLoadingParticipants={isParticipantsLoading}
        participantsError={participantsError}
        deletingParticipantId={deletingParticipantId}
        editingParticipantId={editingParticipantId}
        editParticipantNameValue={editParticipantNameValue}
        savingParticipantId={savingParticipantId}
        availableUsers={availableUsers}
        isLoadingAvailableUsers={isAvailableUsersLoading}
        availableUsersError={availableUsersError}
        addingParticipantUserId={addingParticipantUserId}
        onStartEditParticipant={handleStartEditParticipant}
        onEditParticipantNameValueChange={setEditParticipantNameValue}
        onCancelEditParticipant={handleCancelEditParticipant}
        onSaveEditParticipant={handleSaveEditParticipant}
        onDeleteParticipant={handleDeleteParticipant}
        onAddParticipant={handleAddParticipant}
      />
      <MeetingDeleteDialog
        isSaving={isSaving}
        error={deleteError}
        onConfirm={handleDelete}
        registerOpen={registerDeleteOpen}
      />
    </MeetingDetailsTemplate>
  );
};

export default MeetingDetailsPage;
