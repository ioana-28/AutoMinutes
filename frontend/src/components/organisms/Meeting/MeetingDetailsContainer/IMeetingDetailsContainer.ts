import { MeetingStatus } from '@/hooks/useMeetings';
import { TranscriptResponse } from '@/api/transcriptApi';
import { IActionItem, ActionItemStatus } from '@/hooks/useActionItems';

/**
 * Props for the main MeetingDetailsContainer component
 */
export interface MeetingDetailsContainerProps {
  selectedMeetingId: number | null;
  isInvalidRouteMeetingId: boolean;
  refreshMeetings: () => void | Promise<void>;
}

/**
 * Inferred structure of the core Meeting object based on usage
 */
export interface Meeting {
  id: number;
  title: string;
  description?: string;
  aiStatus?: string | MeetingStatus;
  transcript?: TranscriptResponse | null;
  [key: string]: any; // Fallback for other omitted fields
}

/**
 * Options configuration object passed to useMeetingDetails hook
 */
export interface UseMeetingDetailsOptions {
  onDeleted?: () => void;
  onUpdated?: () => void;
}

/**
 * Return type definition for the useMeetingDetails custom hook
 */
export interface UseMeetingDetailsReturn {
  meeting: Meeting | null;
  meetingTitle: string;
  meetingDateLabel: string;
  draftTitle: string;
  draftDate: string; // Or Date, depending on your date framework implementation
  isEditingTitle: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  deleteError: string | null;
  setDraftTitle: (title: string) => void;
  setDraftDate: (date: string) => void;
  toggleEditTitle: () => void;
  onSave: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  refresh: (force?: boolean) => Promise<void>;
  setStatusOptimistically: (status: MeetingStatus | 'PROCESSING' | 'FAILED') => void;
}

/**
 * Options configuration object passed to useMeetingParticipants hook
 */
export interface UseMeetingParticipantsOptions {
  onParticipantsChanged?: () => void | Promise<void>;
}

/**
 * Return type definition for the useMeetingParticipants custom hook
 */
export interface UseMeetingParticipantsReturn {
  popupProps: {
    isOpen: boolean;
    meetingId: number | null;
    [key: string]: any; // Captures other props passed down to AttendeesListPopup
  };
  openPopup: () => void;
  closePopup: () => void;
}

/**
 * Payload structure expected when saving or updating an action item
 */
export type ActionItemPayload = IActionItem;

/**
 * Complete structure of an Action Item item retrieved from the hook
 */
export type ActionItem = IActionItem;

/**
 * Return type definition for the useActionItems custom hook
 */
export interface UseActionItemsReturn {
  items: ActionItem[];
  isLoading: boolean;
  error: string | null;
  deletingId: number | null;
  savingId: number | null;
  handleSaveActionItem: (payload: ActionItemPayload, meetingId?: number) => Promise<void>;
  handleDeleteActionItem: (id: number) => Promise<void>;
  loadActionItems: () => Promise<void>;
}

/**
 * Explicit state types utilized locally within the container
 */
export type DetailsViewMode = 'overview' | 'participants' | 'action-items';
export type ContentViewMode = 'transcript' | 'summary';