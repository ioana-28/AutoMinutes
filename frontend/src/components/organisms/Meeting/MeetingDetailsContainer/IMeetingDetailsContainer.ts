import { MeetingStatus } from '@/hooks/useMeetings';
import { TranscriptResponse } from '@/api/transcriptApi';
import { IActionItem } from '@/hooks/useActionItems';


export interface MeetingDetailsContainerProps {
  selectedMeetingId: number | null;
  isInvalidRouteMeetingId: boolean;
  refreshMeetings: (silent?: boolean) => void | Promise<void>;
}


export interface Meeting {
  id: number;
  title: string;
  description?: string;
  aiStatus?: string | MeetingStatus;
  transcript?: TranscriptResponse | null;
  [key: string]: any; 
}


export interface UseMeetingDetailsOptions {
  onDeleted?: () => void;
  onUpdated?: () => void;
}


export interface UseMeetingDetailsReturn {
  meeting: Meeting | null;
  meetingTitle: string;
  meetingDateLabel: string;
  draftTitle: string;
  draftDate: string; 
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

export interface UseMeetingParticipantsOptions {
  onParticipantsChanged?: () => void | Promise<void>;
}


export interface UseMeetingParticipantsReturn {
  popupProps: {
    isOpen: boolean;
    meetingId: number | null;
    [key: string]: any; 
  };
  openPopup: () => void;
  closePopup: () => void;
}


export type ActionItemPayload = IActionItem;


export type ActionItem = IActionItem;


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


export type DetailsViewMode = 'overview' | 'participants' | 'action-items';
export type ContentViewMode = 'transcript' | 'summary';