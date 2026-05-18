import { ChangeEvent, FC, useEffect, useRef } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Popup from '@atoms/Popup/Popup';
import Select from '@atoms/Select/Select';
import QuickFilterGroup from '@molecules/QuickFilterGroup/QuickFilterGroup';
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
  onApplyFilter,
  onClearFilter,
  timeFilter,
  onTimeFilterChange,
  variant = 'default',
}) => {
  const isCompact = variant === 'popup';
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFilterOpen && filterRef.current && !filterRef.current.contains(event.target as Node)) {
        onCloseFilter();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen, onCloseFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative" ref={filterRef}>
          <Button
            variant="icon-ghost"
            onClick={onOpenFilter}
            aria-label="Filter action items"
            className={`${isCompact ? 'h-7 w-7' : 'h-8 w-8'} ${isFilterOpen ? 'bg-black/5' : ''}`}
            icon={<Icon name="filter" className={isCompact ? 'h-4 w-4' : 'h-5 w-5'} />}
          />

          <Popup
            isOpen={isFilterOpen}
            titleId="action-item-filter-title"
            variant="popover"
            overlayClassName="left-0 top-full mt-2"
            panelClassName="!p-0"
          >
            <div className="flex items-center justify-between gap-2 bg-[#cad2c5]/40 px-4 py-2">
              <span
                id="action-item-filter-title"
                className="text-[10px] font-bold uppercase tracking-widest text-[#3d5f46]"
              >
                Filters
              </span>
            </div>

            <div className="flex flex-col gap-4 p-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#3d5f46]/70">
                  Status
                </label>
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

              <div className="flex gap-2">
                <Button
                  label="Clear"
                  variant="icon-ghost"
                  onClick={onClearFilter}
                  className="flex-1 px-4 py-1.5 h-auto"
                />
                <Button
                  label="Apply"
                  variant="reprocess"
                  onClick={onApplyFilter}
                  className="flex-1 px-4 py-1.5 h-auto"
                />
              </div>
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
            placeholder="Search action items..."
            icon={<Icon name="search" className={isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
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

      <div className={isCompact ? 'px-1' : ''}>
        <QuickFilterGroup activeFilter={timeFilter} onFilterChange={onTimeFilterChange} />
      </div>
    </div>
  );
};

export default ActionItemListToolbar;
