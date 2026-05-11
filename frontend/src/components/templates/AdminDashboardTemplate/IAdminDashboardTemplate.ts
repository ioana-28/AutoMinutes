export type AdminDashboardUserStatus = 'active' | 'inactive';

export interface IAdminDashboardUserRow {
  id: number;
  name: string;
  status: AdminDashboardUserStatus;
}

export interface IAdminDashboardTemplateProps {
  rows: IAdminDashboardUserRow[];
  onClose: () => void;
  onEditUser: (userId: number) => void;
}
