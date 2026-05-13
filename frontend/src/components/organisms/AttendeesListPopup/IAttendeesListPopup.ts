import { MeetingParticipantApiResponse } from '@/api/userApi';
import { UserApiResponse } from '@/api/userApi';

export interface IAttendeesListPopupProps {
  isOpen: boolean;
  onClose: () => void;
  participants: MeetingParticipantApiResponse[];
  isLoadingParticipants: boolean;
  participantsError: string | null;
  deletingParticipantId: number | null;
  editingParticipantId: number | null;
  editParticipantNameValue: string;
  savingParticipantId: number | null;
  availableUsers: UserApiResponse[];
  isLoadingAvailableUsers: boolean;
  availableUsersError: string | null;
  addingParticipantUserId: number | null;
  onStartEditParticipant: (userId: number, currentName: string) => void;
  onEditParticipantNameValueChange: (value: string) => void;
  onCancelEditParticipant: () => void;
  onSaveEditParticipant: (userId: number) => Promise<void> | void;
  onDeleteParticipant: (userId: number) => Promise<void> | void;
  onAddParticipant: (userId: number) => Promise<void> | void;
}
