export type UserStatus = 'active' | 'inactive';

export interface IUserStatusRowProps {
  userName: string;
  status: UserStatus;
  isUpdating: boolean;
  onToggleStatus: () => void;
}
