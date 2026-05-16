import { ChangeEvent, FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Popup from '@atoms/Popup/Popup';
import Select from '@atoms/Select/Select';
import { IActionItemListToolbarProps } from './IActionItemListToolbar';

const ActionItemListToolbar: FC<IActionItemListToolbarProps> = ({
  searchTerm,
  onSearchTermChange,
  sortKey,
  onSortKeyChange,
  isFilterOpen,
  onOpenFilter,
  onCloseFilter,
  statusFilter,
  onStatusFilterChange,
  variant = 'default',
}) => {
  const isCompact = variant === 'popup';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Button
          variant="icon-ghost"
          onClick={onOpenFilter}
          aria-label="Filter action items"
          className={isCompact ? 'h-7 w-7' : 'h-8 w-8'}
          icon={<Icon name="filter" className={isCompact ? 'h-4 w-4' : 'h-5 w-5'} />}
        />

        <Popup
          isOpen={isFilterOpen}
          titleId="action-item-filter-title"
          variant="popover"
          overlayClassName="left-0 top-full mt-2"
        >
          <div className="flex items-center justify-between gap-2">
            <span
              id="action-item-filter-title"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3d5f46]"
            >
              Filters
            </span>
            <Button
              variant="icon-close"
              onClick={onCloseFilter}
              aria-label="Close filter popup"
              className="h-7 w-7"
              icon={<Icon name="close" className="h-3 w-3" />}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-[#3d5f46]">Status</label>
            <Select
              variant={isCompact ? 'compact' : 'default'}
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: 'Pending', label: 'Pending' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Done', label: 'Done' },
              ]}
            />
          </div>
        </Popup>
      </div>

      <div className={`${isCompact ? 'min-w-[120px]' : 'min-w-[160px]'} flex-1`}>
        <Input
          variant={isCompact ? 'compact' : 'text'}
          value={searchTerm}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onSearchTermChange(event.target.value)
          }
          placeholder="Search..."
        />
      </div>

      <div className={isCompact ? 'min-w-[120px]' : 'min-w-[160px]'}>
        <Select
          variant={isCompact ? 'compact' : 'default'}
          value={sortKey}
          onChange={(event) => onSortKeyChange(event.target.value)}
          options={[
            { value: 'deadline-asc', label: 'Deadline (Soonest)' },
            { value: 'deadline-desc', label: 'Deadline (Latest)' },
            { value: 'description-asc', label: 'Description A-Z' },
            { value: 'description-desc', label: 'Description Z-A' },
          ]}
        />
      </div>
    </div>
  );
};

export default ActionItemListToolbar;
