import { ChangeEvent, FC, useEffect, useRef } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Popup from '@atoms/Popup/Popup';
import Select from '@atoms/Select/Select';
import StatusDot from '@atoms/StatusDot/StatusDot';
import GenericList from '@molecules/GenericList/GenericList';
import { IMeetingListProps, IMeetingListToolbarProps, MeetingListItem } from './IMeetingList';

const DESCRIPTION_PREVIEW_LENGTH = 30;
const COMPACT_DESCRIPTION_LENGTH = 8;

const getDescriptionPreview = (description: string, length: number = DESCRIPTION_PREVIEW_LENGTH) => {
  const normalizedDescription = description.replace(/\s+/g, ' ').trim();

  if (!normalizedDescription) {
    return '';
  }

  if (normalizedDescription.length <= length) {
    return normalizedDescription;
  }

  return `${normalizedDescription.slice(0, length)}...`;
};

export const MeetingListToolbar: FC<IMeetingListToolbarProps> = ({
  searchTerm,
  sortKey,
  isFilterOpen,
  draftStartDate,
  draftEndDate,
  draftStatusFilter,
  draftHasActionItems,
  onOpenFilter,
  onCloseFilter,
  onApplyFilter,
  onClearFilter,
  onDraftStartDateChange,
  onDraftEndDateChange,
  onDraftStatusFilterChange,
  onDraftHasActionItemsChange,
  onSearchTermChange,
  onSortKeyChange,
}) => {
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isFilterOpen &&
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        onCloseFilter();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen, onCloseFilter]);

  return (
    <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 sm:gap-2">
      <div className="relative" ref={filterRef}>
        <Button
          variant="icon-ghost"
          onClick={onOpenFilter}
          aria-label="Filter meetings"
          className={isFilterOpen ? 'bg-black/5' : ''}
          icon={<Icon name="filter" className="h-4 w-4 sm:h-5 sm:w-5" />}
        />

        <Popup
          isOpen={isFilterOpen}
          titleId="meeting-filter-title"
          variant="popover"
          overlayClassName="left-0 top-full mt-2"
          panelClassName="!p-0"
        >
          <div className="flex items-center justify-between gap-2 bg-[#cad2c5]/40 px-4 py-2">
            <span
              id="meeting-filter-title"
              className="text-[10px] font-bold uppercase tracking-widest text-[#3d5f46]"
            >
              Filters
            </span>
          </div>

          <div className="flex flex-col gap-2.5 p-3 min-w-[260px]">
            <div className="flex items-center gap-2">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-[8.5px] font-bold uppercase tracking-widest text-[#3d5f46]/70">
                  Start Date
                </label>
                <Input
                  type="date"
                  variant="compact"
                  className="!min-h-[28px] !px-2 !py-0.5 !text-[10.5px]"
                  value={draftStartDate}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onDraftStartDateChange(event.target.value)
                  }
                />
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <label className="text-[8.5px] font-bold uppercase tracking-widest text-[#3d5f46]/70">
                  End Date
                </label>
                <Input
                  type="date"
                  variant="compact"
                  className="!min-h-[28px] !px-2 !py-0.5 !text-[10.5px]"
                  value={draftEndDate}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onDraftEndDateChange(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8.5px] font-bold uppercase tracking-widest text-[#3d5f46]/70">
                AI Status
              </label>
              <Select
                variant="compact"
                className="!min-h-[28px] !text-[10.5px]"
                value={draftStatusFilter}
                onChange={(event) => onDraftStatusFilterChange(event.target.value)}
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'FAILED', label: 'Failed' },
                  { value: 'IDLE', label: 'Idle' },
                ]}
              />
            </div>

            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="has-action-items-filter"
                checked={draftHasActionItems}
                onChange={(e) => onDraftHasActionItemsChange(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-[#7f9d86]/40 text-[#3d5f46] focus:ring-[#3d5f46]/20"
              />
              <label
                htmlFor="has-action-items-filter"
                className="text-[10.5px] font-medium text-[#1f2937]/70 cursor-pointer"
              >
                Meetings with action items
              </label>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                label="Clear"
                variant="icon-ghost"
                onClick={onClearFilter}
                className="flex-1 px-2 py-1 h-7.5 text-[10.5px] font-semibold"
              />
              <Button
                label="Apply"
                variant="reprocess"
                onClick={onApplyFilter}
                className="flex-1 px-2 py-1 h-7.5 text-[10.5px] font-semibold"
              />
            </div>
          </div>
        </Popup>
      </div>

      <div className="min-w-[160px] flex-1">
        <Input
          value={searchTerm}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onSearchTermChange(event.target.value)
          }
          placeholder="Search meetings..."
          icon={<Icon name="search" className="h-4 w-4" />}
        />
      </div>

      <div className="min-w-[160px]">
        <Select
          value={sortKey}
          onChange={(event) => onSortKeyChange(event.target.value)}
          options={[
            { value: 'date-desc', label: 'Newest first' },
            { value: 'date-asc', label: 'Oldest first' },
            { value: 'title-asc', label: 'Title A-Z' },
            { value: 'title-desc', label: 'Title Z-A' },
            { value: 'status', label: 'Status' },
          ]}
        />
      </div>
    </div>
  );
};

const MeetingList: FC<IMeetingListProps> = ({
  isLoading,
  error,
  items,
  selectedId,
  onInfoClick,
  isCompact = false,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-[#7f9d86]/40 bg-[#efebe2] p-8 text-center text-[#1f2937]/60">
        Loading meetings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[#b33a3a]/30 bg-[#f4c7c7]/30 p-6 text-center text-[#6b1f1f]">
        {error}
      </div>
    );
  }

  return (
    <GenericList<MeetingListItem>
      items={items}
      getItemId={(item) => item.id}
      selectedId={selectedId}
      onItemClick={(id) => onInfoClick(id as number)}
      emptyMessage="No meetings found."
      variant={isCompact ? 'panel' : 'default'}
      renderLeft={(item) => {
        const descriptionPreview = getDescriptionPreview(
          item.description,
          isCompact ? COMPACT_DESCRIPTION_LENGTH : DESCRIPTION_PREVIEW_LENGTH,
        );

        return (
          <div className="flex min-w-0 items-center gap-2 sm:gap-6">
            <span className="w-16 sm:w-24 shrink-0 whitespace-nowrap text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[#3d5f46]/50">
              {item.dateLabel}
            </span>
            <div className="min-w-0">
              <span className="block truncate text-sm sm:text-base font-semibold text-[#1f2937]">{item.title}</span>
              {descriptionPreview ? (
                <span className="mt-0.5 block max-w-[140px] sm:max-w-none truncate text-[10px] sm:text-xs font-medium leading-5 text-[#1f2937]/50">
                  {descriptionPreview}
                </span>
              ) : null}
            </div>
          </div>
        );
      }}
      renderRight={(item) => {
        const attendeesLabel = `${item.attendeesCount} attendee${item.attendeesCount === 1 ? '' : 's'}`;
        const actionItemsLabel = `${item.actionItemsCount} action item${
          item.actionItemsCount === 1 ? '' : 's'
        }`;

        return (
          <div className="flex items-center gap-1.5 sm:gap-3">
            <span className="whitespace-nowrap rounded-full border border-[#d5c9b6]/70 bg-[#f6f1e8] px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-semibold text-[#2F3A3A]/80">
              {attendeesLabel}
            </span>
            <span className="whitespace-nowrap rounded-full border border-[#d5c9b6]/70 bg-[#f6f1e8] px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-semibold text-[#2F3A3A]/80">
              {actionItemsLabel}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-[70px] sm:min-w-[90px] justify-end">
              <StatusDot status={item.status} />
              <span className="hidden xs:block text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[#3d5f46]/60">
                {item.status}
              </span>
            </div>
            <Button
              variant="icon-ghost"
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick(item.id);
              }}
              aria-label="Meeting details"
              className="h-7 w-7 sm:h-8 sm:w-8"
              icon={<Icon name="info" className="h-4 w-4 sm:h-5 sm:w-5" />}
            />
          </div>
        );
      }}
    />
  );
};

export default MeetingList;
