import { MeetingParticipantApiResponse } from '@/api/meetingApi';

export interface IAttendeesListPopupProps {
  isOpen: boolean;
  onClose: () => void;
  participants: MeetingParticipantApiResponse[];
  isLoadingParticipants: boolean;
  participantsError: string | null;
  deletingParticipantId: number | null;
  onDeleteParticipant: (userId: number) => Promise<void> | void;
}
