import { FC } from 'react';
import UserStatusRow from '@molecules/UserStatusRow/UserStatusRow';
import GenericList from '@organisms/GenericList/GenericList';
import { IUserStatusListProps, IUserStatusRowData } from './IUserStatusList';

const UserStatusList: FC<IUserStatusListProps> = ({
  rows,
  isLoading,
  errorMessage,
  updatingUserId,
  onEditUser,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-[18px] border-[3px] border-[#1e3522] bg-[#efebe2] px-6 py-4 text-base font-semibold text-[#1f2937]">
        Loading users...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-[18px] border-[3px] border-[#8b3a3a] bg-[#f6d9d9] px-6 py-4 text-base font-semibold text-[#6b1f1f]">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border-[3px] border-[#1e3522] bg-[#a4c3b2] p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_260px] px-6 pb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#1f2937]">
        <span>USER</span>
        <span>STATUS</span>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <UserStatusRow
            key={row.id}
            userName={row.name}
            status={row.status}
            isUpdating={updatingUserId === row.id}
            onToggleStatus={() => onEditUser(row.id)}
          />
        ))}
        {rows.length === 0 && (
          <div className="rounded-[18px] border-[3px] border-[#1e3522] bg-[#efebe2] px-6 py-4 text-base font-semibold text-[#1f2937]">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStatusList;
