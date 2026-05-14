import { FC } from 'react';
import { StatusDotProps, StatusDotStatus } from './IStatusDot';

const getStatusClasses = (status: StatusDotStatus) => {
  switch (status) {
    case 'COMPLETED':
      return 'border-[#2f6f3b] bg-[#cfe7d2] text-[#1f3f26]';
    case 'PROCESSING':
      return 'border-[#9a7d3a] bg-[#f2e1b8] text-[#5f4a1e]';
    case 'FAILED':
      return 'border-[#b33a3a] bg-[#f4c7c7] text-[#6b1f1f]';
    case 'IDLE':
      return 'border-[#6b7280] bg-[#e5e7eb] text-[#374151]';
    default:
      return 'border-[#7f9d86] bg-[#efebe2] text-[#1f2937]';
  }
};

const StatusDot: FC<StatusDotProps> = ({ status, className = '', title }) => (
  <span
    className={`h-3 w-3 rounded-full border ${getStatusClasses(status)} ${className}`.trim()}
    aria-label={`Status: ${status}`}
    title={title ?? status}
  />
);

export default StatusDot;
