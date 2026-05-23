import { MeetingParticipantApiResponse } from '@/api/userApi';

export interface AttendeeListState {
  participants: MeetingParticipantApiResponse[];
  isLoading: boolean;
  error: string | null;
  savingParticipantId: number | null;
  deletingParticipantId: number | null;
}

export interface AttendeeListActions {
  onRequestDeleteParticipant: (userId: number) => void;
}

export interface IAttendeeListProps {
  state: AttendeeListState;
  actions: AttendeeListActions;
  variant?: 'default' | 'panel';
}
