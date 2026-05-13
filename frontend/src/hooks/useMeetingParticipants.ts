import { useEffect, useState } from 'react';
import {
  addMeetingParticipant,
  deleteMeetingParticipant,
  getMeetingParticipants,
  MeetingParticipantApiResponse,
  updateMeetingParticipant,
  getUsers,
  UserApiResponse,
} from '@/api/userApi';
import { IAttendeesListPopupProps } from '@organisms/AttendeesListPopup/IAttendeesListPopup';

type MeetingParticipantsHook = {
  popupProps: IAttendeesListPopupProps;
  openPopup: () => void;
  closePopup: () => void;
};

const useMeetingParticipants = (meetingId: number | null): MeetingParticipantsHook => {
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    if (!isOpen || meetingId === null) {
      return;
    }

    const controller = new AbortController();

    const fetchParticipants = async () => {
      try {
        setIsParticipantsLoading(true);
        setParticipantsError(null);
        const data = await getMeetingParticipants(meetingId, controller.signal);
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
  }, [isOpen, meetingId]);

  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen]);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleDeleteParticipant = async (userId: number) => {
    if (meetingId === null) {
      return;
    }

    try {
      setDeletingParticipantId(userId);
      setParticipantsError(null);
      await deleteMeetingParticipant(meetingId, userId);
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
    if (meetingId === null || editingParticipantId !== userId) {
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
      const updatedParticipant = await updateMeetingParticipant(meetingId, userId, {
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
    if (meetingId === null) {
      return;
    }

    if (participants.some((participant) => participant.id === userId)) {
      setParticipantsError('Participant is already in this meeting.');
      throw new Error('Participant is already in this meeting.');
    }

    try {
      setAddingParticipantUserId(userId);
      setParticipantsError(null);
      await addMeetingParticipant(meetingId, userId);
      const refreshedParticipants = await getMeetingParticipants(meetingId);
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

  return {
    popupProps: {
      isOpen,
      onClose: closePopup,
      participants,
      isLoadingParticipants: isParticipantsLoading,
      participantsError,
      deletingParticipantId,
      editingParticipantId,
      editParticipantNameValue,
      savingParticipantId,
      availableUsers,
      isLoadingAvailableUsers: isAvailableUsersLoading,
      availableUsersError,
      addingParticipantUserId,
      onStartEditParticipant: handleStartEditParticipant,
      onEditParticipantNameValueChange: setEditParticipantNameValue,
      onCancelEditParticipant: handleCancelEditParticipant,
      onSaveEditParticipant: handleSaveEditParticipant,
      onDeleteParticipant: handleDeleteParticipant,
      onAddParticipant: handleAddParticipant,
    },
    openPopup,
    closePopup,
  };
};

export default useMeetingParticipants;
