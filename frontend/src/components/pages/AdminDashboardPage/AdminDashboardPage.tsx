import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import AdminDashboardTemplate from '@templates/AdminDashboardTemplate/AdminDashboardTemplate';
import DashboardHeader from '@molecules/DashboardHeader/DashboardHeader';
import UserStatusList from '@organisms/Admin/UserStatusList/UserStatusList';
import { useUsers } from '@/hooks/useUsers';

const AdminDashboardPage: FC = () => {
  const navigate = useNavigate();
  const { rows, isLoading, error, updatingUserId, handleEditUser } = useUsers();

  return (
    <MeetingLayoutTemplate
      activePage="admin"
      contentClassName="max-w-[1400px]"
      onNavigateMeetingList={() => navigate('/meeting-list')}
      onNavigateToDoList={() => navigate('/to-do-list')}
    >
      <AdminDashboardTemplate
        header={<DashboardHeader title="ADMIN DASHBOARD" onClose={() => navigate('/meeting-list')} />}
      >
        <UserStatusList
          rows={rows}
          isLoading={isLoading}
          errorMessage={error}
          updatingUserId={updatingUserId}
          onEditUser={handleEditUser}
        />
      </AdminDashboardTemplate>
    </MeetingLayoutTemplate>
  );
};

export default AdminDashboardPage;
