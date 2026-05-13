import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import StatusDot from '@atoms/StatusDot/StatusDot';
import { StatusDotStatus } from '@atoms/StatusDot/IStatusDot';
import { IUserStatusRowProps, UserStatus } from './IUserStatusRow';

const statusDotMap: Record<UserStatus, StatusDotStatus> = {
  active: 'COMPLETED',
  inactive: 'FAILED',
};

const statusLabelMap: Record<UserStatus, string> = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
};

const UserStatusRow: FC<IUserStatusRowProps> = ({
  userName,
  status,
  isUpdating,
  onToggleStatus,
}) => (
  <div className="grid grid-cols-[minmax(0,1fr)_260px] items-center rounded-[18px] border-[3px] border-[#1e3522] bg-[#efebe2] px-6 py-3">
    <span className="truncate text-lg font-semibold text-[#1f2937]">{userName}</span>

    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <StatusDot status={statusDotMap[status]} />
        <span className="text-sm font-semibold text-[#1f2937]">{statusLabelMap[status]}</span>
      </div>

      <Button
        variant="icon-ghost"
        onClick={onToggleStatus}
        aria-label={`Toggle status for ${userName}`}
        className={`h-8 w-8 border border-[#8aa08d] ${isUpdating ? 'opacity-70' : ''}`.trim()}
        icon={<Icon name="edit" className="h-4 w-4" />}
        disabled={isUpdating}
      />
    </div>
  </div>
);

export default UserStatusRow;
