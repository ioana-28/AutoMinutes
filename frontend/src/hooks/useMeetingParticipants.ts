import { useEffect, useState } from 'react';
import {
  addMeetingParticipant,
  deleteMeetingParticipant,
  getMeetingParticipants,
  MeetingParticipantApiResponse,
  getUsers,
  UserApiResponse,
} from '@/api/userApi';
import { IAttendeesListPopupProps } from '@organisms/Atendees/AttendeesListPopup/IAttendeesListPopup';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

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
        setSavingParticipantId(null);
        setAddingParticipantUserId(null);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setParticipantsError(ERROR_MESSAGES.PARTICIPANTS_LOAD_FAILED);
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
        setAvailableUsersError(ERROR_MESSAGES.USERS_LOAD_FAILED);
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
    } catch {
      setParticipantsError(ERROR_MESSAGES.PARTICIPANT_REMOVE_FAILED);
      throw new Error(ERROR_MESSAGES.PARTICIPANT_REMOVE_FAILED);
    } finally {
      setDeletingParticipantId(null);
    }
  };

  const handleAddParticipant = async (userId: number) => {
    if (meetingId === null) {
      return;
    }

    if (participants.some((participant) => participant.id === userId)) {
      setParticipantsError(ERROR_MESSAGES.PARTICIPANT_ALREADY_EXISTS);
      throw new Error(ERROR_MESSAGES.PARTICIPANT_ALREADY_EXISTS);
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
      setParticipantsError(ERROR_MESSAGES.PARTICIPANT_ADD_FAILED);
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
      savingParticipantId,
      availableUsers,
      isLoadingAvailableUsers: isAvailableUsersLoading,
      availableUsersError,
      addingParticipantUserId,
      onDeleteParticipant: handleDeleteParticipant,
      onAddParticipant: handleAddParticipant,
    },
    openPopup,
    closePopup,
  };
};

export default useMeetingParticipants;
