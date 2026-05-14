import { MeetingParticipantApiResponse } from '@/api/userApi';

export interface AttendeeListState {
  participants: MeetingParticipantApiResponse[];
  isLoading: boolean;
  error: string | null;
  editingParticipantId: number | null;
  savingParticipantId: number | null;
  deletingParticipantId: number | null;
  editParticipantNameValue: string;
}

export interface AttendeeListActions {
  onEditParticipantNameValueChange: (value: string) => void;
  onStartEditParticipant: (userId: number, currentName: string) => void;
  onCancelEditParticipant: () => void;
  onSaveEditParticipant: (userId: number) => Promise<void> | void;
  onRequestDeleteParticipant: (userId: number) => void;
}

export interface IAttendeeListProps {
  state: AttendeeListState;
  actions: AttendeeListActions;
}
