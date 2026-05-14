import { MeetingParticipantApiResponse } from '@/api/userApi';
import { UserApiResponse } from '@/api/userApi';

export interface IAttendeesListPopupProps {
  isOpen: boolean;
  onClose: () => void;
  participants: MeetingParticipantApiResponse[];
  isLoadingParticipants: boolean;
  participantsError: string | null;
  deletingParticipantId: number | null;
  savingParticipantId: number | null;
  availableUsers: UserApiResponse[];
  isLoadingAvailableUsers: boolean;
  availableUsersError: string | null;
  addingParticipantUserId: number | null;
  onDeleteParticipant: (userId: number) => Promise<void> | void;
  onAddParticipant: (userId: number) => Promise<void> | void;
}
