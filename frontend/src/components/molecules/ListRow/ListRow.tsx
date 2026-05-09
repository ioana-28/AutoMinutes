import { FC } from 'react';
import { IListRowProps } from './IListRow';

const ListRow: FC<IListRowProps> = ({ leftSlot, rightSlot, className = '' }) => (
  <div className={`flex w-full items-center justify-between gap-4 ${className}`.trim()}>
    <div className="flex min-w-0 items-center gap-4">{leftSlot}</div>
    <div className="flex items-center gap-3">{rightSlot}</div>
  </div>
);

export default ListRow;
