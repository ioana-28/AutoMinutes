import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import UserStatusRow from '@molecules/UserStatusRow/UserStatusRow';
import { IAdminDashboardTemplateProps } from './IAdminDashboardTemplate';

const AdminDashboardTemplate: FC<IAdminDashboardTemplateProps> = ({
  rows,
  isLoading,
  errorMessage,
  updatingUserId,
  onClose,
  onEditUser,
}) => {
  return (
    <section className="w-full rounded-[18px] border-[3px] border-[#1e3522] bg-[#cad2c5] p-5 shadow-[0_16px_36px_-24px_rgba(15,23,42,0.5)]">
      <header className="relative rounded-[14px] border-[3px] border-[#1e3522] bg-[#386641] px-6 py-4">
        <h1 className="m-0 text-center text-2xl font-bold uppercase tracking-[0.08em] text-[#f8f6f1]">
          ADMIN DASHBOARD
        </h1>
        <Button
          variant="icon-close"
          onClick={onClose}
          aria-label="Close admin dashboard"
          className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 border-none bg-transparent text-[#ffb6c9] shadow-none"
          icon={<Icon name="close" className="h-7 w-7" />}
        />
      </header>

      <div className="mt-5 rounded-[16px] border-[3px] border-[#1e3522] bg-[#a4c3b2] p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_260px] px-6 pb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#1f2937]">
          <span>USER</span>
          <span>STATUS</span>
        </div>

        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="rounded-[18px] border-[3px] border-[#1e3522] bg-[#efebe2] px-6 py-4 text-base font-semibold text-[#1f2937]">
              Loading users...
            </div>
          ) : errorMessage ? (
            <div className="rounded-[18px] border-[3px] border-[#8b3a3a] bg-[#f6d9d9] px-6 py-4 text-base font-semibold text-[#6b1f1f]">
              {errorMessage}
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-[18px] border-[3px] border-[#1e3522] bg-[#efebe2] px-6 py-4 text-base font-semibold text-[#1f2937]">
              No users found.
            </div>
          ) : (
            rows.map((row) => (
              <UserStatusRow
                key={row.id}
                userName={row.name}
                status={row.status}
                isUpdating={updatingUserId === row.id}
                onToggleStatus={() => onEditUser(row.id)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardTemplate;
