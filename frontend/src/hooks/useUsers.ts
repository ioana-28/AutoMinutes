import { useEffect, useMemo, useState } from 'react';
import { getUsers, updateUserStatus, UserApiResponse } from '@/api/userApi';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

const mapUserName = (user: UserApiResponse) => {
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  if (fullName) {
    return fullName;
  }
  const fallbackEmail = user.email?.trim();
  return fallbackEmail || 'Unknown user';
};

export const useUsers = () => {
  const [users, setUsers] = useState<UserApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUsers(controller.signal);
        setUsers(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError(ERROR_MESSAGES.USERS_LOAD_FAILED);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, []);

  const rows = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        name: mapUserName(user),
        status: (user.activityStatus === 'ACTIVE' ? 'active' : 'inactive') as 'active' | 'inactive',
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
      setError(null);
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
      setError(ERROR_MESSAGES.USER_STATUS_UPDATE_FAILED);
    } finally {
      setUpdatingUserId(null);
    }
  };

  return {
    rows,
    isLoading,
    error,
    updatingUserId,
    handleEditUser,
  };
};
