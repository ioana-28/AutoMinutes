import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import AdminDashboardTemplate from '@templates/AdminDashboardTemplate/AdminDashboardTemplate';
import DashboardHeader from '@molecules/DashboardHeader/DashboardHeader';
import UserStatusList from '@organisms/UserStatusList/UserStatusList';
import { IUserStatusRowData } from '@organisms/UserStatusList/IUserStatusList';
import { getUsers, updateUserStatus, UserApiResponse } from '@/api/userApi';

const mapUserName = (user: UserApiResponse) => {
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  if (fullName) {
    return fullName;
  }
  const fallbackEmail = user.email?.trim();
  return fallbackEmail || 'Unknown user';
};

const AdminDashboardPage: FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserApiResponse[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        setUsersError(null);
        const data = await getUsers(controller.signal);
        setUsers(data);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        setUsersError('Unable to load users.');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, []);

  const rows = useMemo<IUserStatusRowData[]>(
    () =>
      users.map((user) => ({
        id: user.id,
        name: mapUserName(user),
        status: user.activityStatus === 'ACTIVE' ? 'active' : 'inactive',
      })),
    [users],
  );

  const handleEditUser = async (userId: number) => {
    const targetUser = users.find((user) => user.id === userId);
    if (!targetUser) {
      return;
    }

    const currentStatus = targetUser.activityStatus === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      setUpdatingUserId(userId);
      setUsersError(null);
      const updatedUser = await updateUserStatus(userId, nextStatus === 'ACTIVE');
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === userId
            ? {
                ...currentUser,
                ...updatedUser,
                activityStatus: updatedUser.activityStatus ?? nextStatus,
              }
            : currentUser,
        ),
      );
    } catch {
      setUsersError('Unable to update user status.');
    } finally {
      setUpdatingUserId(null);
    }
  };

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
          isLoading={isLoadingUsers}
          errorMessage={usersError}
          updatingUserId={updatingUserId}
          onEditUser={handleEditUser}
        />
      </AdminDashboardTemplate>
    </MeetingLayoutTemplate>
  );
};

export default AdminDashboardPage;
