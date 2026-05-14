import { UserApiResponse } from '@/api/userApi';

export interface AddAttendeeSectionState {
  isLoading: boolean;
  error: string | null;
  availableUsers: UserApiResponse[];
  filteredUsers: UserApiResponse[];
  searchTerm: string;
  selectedUserId: number | null;
  selectedUser: UserApiResponse | null;
  canSave: boolean;
}

export interface AddAttendeeSectionActions {
  onSearchChange: (value: string) => void;
  onSelectUser: (userId: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface IAddAttendeeSectionProps {
  state: AddAttendeeSectionState;
  actions: AddAttendeeSectionActions;
}
