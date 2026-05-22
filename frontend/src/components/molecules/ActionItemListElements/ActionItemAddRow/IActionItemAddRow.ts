import { IActionItemListProps } from '@organisms/ActionItems/ActionItemList/IActionItemList';
import { UserApiResponse } from '@/api/userApi';

export interface ActionItemAddRowProps {
  isPanel: boolean;
  addControls: IActionItemListProps['addControls'];
  assigneeSearchTermAdd: string;
  setAssigneeSearchTermAdd: (value: string) => void;
  isAssigneeLoading: boolean;
  assigneeError: string | null;
  filteredAssigneeUsersAdd: UserApiResponse[];
  isAssigneeAddingOpen: boolean;
  setIsAssigneeAddingOpen: (open: boolean) => void;
  selectedAssigneeAdd: UserApiResponse | null;
  statusOptions: { value: any; label: string }[];
}