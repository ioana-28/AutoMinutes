import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import StatusDot from '@atoms/StatusDot/StatusDot';
import { StatusDotStatus } from '@atoms/StatusDot/IStatusDot';
import {
  AdminDashboardUserStatus,
  IAdminDashboardTemplateProps,
} from './IAdminDashboardTemplate';

const statusDotMap: Record<AdminDashboardUserStatus, StatusDotStatus> = {
  active: 'COMPLETED',
  inactive: 'FAILED',
};

const statusLabelMap: Record<AdminDashboardUserStatus, string> = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
};

const AdminDashboardTemplate: FC<IAdminDashboardTemplateProps> = ({ rows, onClose, onEditUser }) => {
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
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[minmax(0,1fr)_260px] items-center rounded-[18px] border-[3px] border-[#1e3522] bg-[#efebe2] px-6 py-3"
            >
              <span className="truncate text-lg font-semibold text-[#1f2937]">{row.name}</span>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <StatusDot status={statusDotMap[row.status]} />
                  <span className="text-sm font-semibold text-[#1f2937]">
                    {statusLabelMap[row.status]}
                  </span>
                </div>

                <Button
                  variant="icon-ghost"
                  onClick={() => onEditUser(row.id)}
                  aria-label={`Edit user ${row.name}`}
                  className="h-8 w-8 border border-[#8aa08d]"
                  icon={<Icon name="edit" className="h-4 w-4" />}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardTemplate;
