import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import AdminDashboardTemplate from '@templates/AdminDashboardTemplate/AdminDashboardTemplate';
import { IAdminDashboardUserRow } from '@templates/AdminDashboardTemplate/IAdminDashboardTemplate';

const demoUsers: IAdminDashboardUserRow[] = [
  { id: 1, name: 'Alexandra Popescu', status: 'active' },
  { id: 2, name: 'Mihai Ionescu', status: 'inactive' },
  { id: 3, name: 'Elena Stan', status: 'active' },
  { id: 4, name: 'Radu Marin', status: 'inactive' },
  { id: 5, name: 'Sofia Dumitrescu', status: 'active' },
];

const AdminDashboardPage: FC = () => {
  const navigate = useNavigate();
  const handleEditUser = (_userId: number) => undefined;

  return (
    <MeetingLayoutTemplate
      activePage="admin"
      contentClassName="max-w-[1400px]"
      onNavigateMeetingList={() => navigate('/meeting-list')}
      onNavigateToDoList={() => navigate('/to-do-list')}
    >
      <AdminDashboardTemplate
        rows={demoUsers}
        onClose={() => navigate('/meeting-list')}
        onEditUser={handleEditUser}
      />
    </MeetingLayoutTemplate>
  );
};

export default AdminDashboardPage;
