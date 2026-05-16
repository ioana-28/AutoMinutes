export interface IAddMeetingModalProps {
  onCreateMeeting: (
    title: string,
    file: File | null,
    meetingDate: string | null,
  ) => Promise<void> | void;
  isCreatingMeeting?: boolean;
  createMeetingError?: string | null;
}
