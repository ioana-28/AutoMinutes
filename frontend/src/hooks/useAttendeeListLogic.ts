import { useMemo, useState } from 'react';
import { getSearchableUserText } from '@/utils/participantUtils';
import { IAttendeesListPopupProps } from '@organisms/Atendees/AttendeesListPopup/IAttendeesListPopup';

type AttendeeListLogicProps = Omit<IAttendeesListPopupProps, 'isOpen'>;

const useAttendeeListLogic = ({
  onClose,
  participants,
  isLoadingParticipants,
  participantsError,
  deletingParticipantId,
  savingParticipantId,
  availableUsers,
  isLoadingAvailableUsers,
  availableUsersError,
  addingParticipantUserId,
  onDeleteParticipant,
  onAddParticipant,
}: AttendeeListLogicProps) => {
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [addParticipantSearchTerm, setAddParticipantSearchTerm] = useState('');
  const [participantIdPendingDelete, setParticipantIdPendingDelete] = useState<number | null>(null);
  const [deleteParticipantError, setDeleteParticipantError] = useState<string | null>(null);

  const availableUsersToAdd = useMemo(() => {
    const existingParticipantIds = new Set(participants.map((participant) => participant.id));

    return availableUsers.filter((user) => !existingParticipantIds.has(user.id));
  }, [availableUsers, participants]);

  const filteredUsersToAdd = useMemo(() => {
    if (!isAddingParticipant) {
      return [];
    }

    const normalizedSearchTerm = addParticipantSearchTerm.trim().toLowerCase();
    if (!normalizedSearchTerm) {
      return [];
    }

    return availableUsersToAdd.filter((user) =>
      getSearchableUserText(user.firstName, user.lastName, user.email).includes(
        normalizedSearchTerm,
      ),
    );
  }, [isAddingParticipant, addParticipantSearchTerm, availableUsersToAdd]);

  const effectiveSelectedUserId = useMemo(() => {
    if (!isAddingParticipant) {
      return null;
    }

    if (selectedUserId !== null && availableUsersToAdd.some((user) => user.id === selectedUserId)) {
      return selectedUserId;
    }

    return null;
  }, [isAddingParticipant, selectedUserId, availableUsersToAdd]);

  const handleOpenAddParticipant = () => {
    setIsAddingParticipant(true);
    setSelectedUserId(null);
    setAddParticipantSearchTerm('');
  };

  const handleCancelAddParticipant = () => {
    setIsAddingParticipant(false);
    setSelectedUserId(null);
    setAddParticipantSearchTerm('');
  };

  const handleSaveAddParticipant = async () => {
    if (
      effectiveSelectedUserId === null ||
      addingParticipantUserId !== null ||
      !availableUsersToAdd.some((user) => user.id === effectiveSelectedUserId)
    ) {
      return;
    }

    try {
      await onAddParticipant(effectiveSelectedUserId);
      setIsAddingParticipant(false);
      setSelectedUserId(null);
      setAddParticipantSearchTerm('');
    } catch {
      return;
    }
  };

  const handleAddParticipantSearchChange = (value: string) => {
    setAddParticipantSearchTerm(value);
    setSelectedUserId(null);
  };

  const handleSelectParticipantUser = (userId: number) => {
    setSelectedUserId(userId);
  };

  const canSaveSelectedUser =
    effectiveSelectedUserId !== null &&
    addingParticipantUserId === null &&
    availableUsersToAdd.some((user) => user.id === effectiveSelectedUserId);
  const selectedUserToAdd =
    effectiveSelectedUserId === null
      ? null
      : (availableUsersToAdd.find((user) => user.id === effectiveSelectedUserId) ?? null);

  const isDeleteParticipantConfirmOpen = participantIdPendingDelete !== null;
  const isDeletingSelectedParticipant =
    participantIdPendingDelete !== null && deletingParticipantId === participantIdPendingDelete;

  const handleOpenDeleteParticipantConfirm = (participantId: number) => {
    setParticipantIdPendingDelete(participantId);
    setDeleteParticipantError(null);
  };

  const handleCancelDeleteParticipant = () => {
    setParticipantIdPendingDelete(null);
    setDeleteParticipantError(null);
  };

  const handleClosePopup = () => {
    setParticipantIdPendingDelete(null);
    setDeleteParticipantError(null);
    onClose();
  };

  const handleConfirmDeleteParticipant = async () => {
    if (participantIdPendingDelete === null || isDeletingSelectedParticipant) {
      return;
    }

    try {
      setDeleteParticipantError(null);
      await onDeleteParticipant(participantIdPendingDelete);
      setParticipantIdPendingDelete(null);
    } catch (error) {
      if (error instanceof Error && error.message.trim()) {
        setDeleteParticipantError(error.message);
        return;
      }
      setDeleteParticipantError('Unable to remove participant.');
    }
  };

  return {
    addAttendeeControls: {
      isAddingParticipant,
      onOpenAddParticipant: handleOpenAddParticipant,
    },
    addAttendeeProps: {
      state: {
        isLoading: isLoadingAvailableUsers,
        error: availableUsersError,
        availableUsers: availableUsersToAdd,
        filteredUsers: filteredUsersToAdd,
        searchTerm: addParticipantSearchTerm,
        selectedUserId: effectiveSelectedUserId,
        selectedUser: selectedUserToAdd,
        canSave: canSaveSelectedUser,
      },
      actions: {
        onSearchChange: handleAddParticipantSearchChange,
        onSelectUser: handleSelectParticipantUser,
        onSave: handleSaveAddParticipant,
        onCancel: handleCancelAddParticipant,
      },
    },
    listProps: {
      state: {
        participants,
        isLoading: isLoadingParticipants,
        error: participantsError,
        savingParticipantId,
        deletingParticipantId,
      },
      actions: {
        onRequestDeleteParticipant: handleOpenDeleteParticipantConfirm,
      },
    },
    deleteDialogProps: {
      isOpen: isDeleteParticipantConfirmOpen,
      isSaving: isDeletingSelectedParticipant,
      error: deleteParticipantError,
      onCancel: handleCancelDeleteParticipant,
      onConfirm: handleConfirmDeleteParticipant,
    },
    popupActions: {
      onClose: handleClosePopup,
    },
  };
};

export default useAttendeeListLogic;
