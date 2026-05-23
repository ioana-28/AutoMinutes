import { IActionItem } from '@/hooks/useActionItems';
import { UserApiResponse } from '@/api/userApi';

export interface ActionItemExpandedContentProps {
  item: IActionItem;
  isPanel: boolean;
  lowConfidence: boolean;
  handleConfirmActionItem: (item: IActionItem) => void;
  assigneeEditId: number | null;
  handleOpenAssigneeEditor: (item: IActionItem) => void;
  handleCancelAssigneeEditor: () => void;
  handleSaveAssignee: (item: IActionItem) => void;
  assigneeSearchTerm: string;
  setAssigneeSearchTerm: (value: string) => void;
  isAssigneeLoading: boolean;
  assigneeError: string | null;
  filteredAssigneeUsers: UserApiResponse[];
  selectedAssigneeId: number | null;
  setSelectedAssigneeId: (value: number | null) => void;
  selectedAssignee: UserApiResponse | null;
}