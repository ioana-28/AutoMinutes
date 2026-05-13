import { UserStatus } from '@molecules/UserStatusRow/IUserStatusRow';

export interface IUserStatusRowData {
  id: number;
  name: string;
  status: UserStatus;
}

export interface IUserStatusListProps {
  rows: IUserStatusRowData[];
  isLoading: boolean;
  errorMessage: string | null;
  updatingUserId: number | null;
  onEditUser: (userId: number) => void;
}
