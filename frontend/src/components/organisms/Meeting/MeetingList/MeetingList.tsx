import { ChangeEvent, FC, useEffect, useRef } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Popup from '@atoms/Popup/Popup';
import Select from '@atoms/Select/Select';
import StatusDot from '@atoms/StatusDot/StatusDot';
import GenericList from '@molecules/GenericList/GenericList';
import { IMeetingListProps, IMeetingListToolbarProps, MeetingListItem } from './IMeetingList';

const DESCRIPTION_PREVIEW_LENGTH = 50;

const getDescriptionPreview = (description: string) => {
  const normalizedDescription = description.replace(/\s+/g, ' ').trim();

  if (!normalizedDescription) {
    return '';
  }

  if (normalizedDescription.length <= DESCRIPTION_PREVIEW_LENGTH) {
    return normalizedDescription;
  }

  return `${normalizedDescription.slice(0, DESCRIPTION_PREVIEW_LENGTH)}...`;
};

export const MeetingListToolbar: FC<IMeetingListToolbarProps> = ({
  searchTerm,
  sortKey,
  isFilterOpen,
  draftFilterDate,
  onOpenFilter,
  onCloseFilter,
  onApplyFilter,
  onClearFilter,
  onDraftFilterDateChange,
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
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative" ref={filterRef}>
        <Button
          variant="icon-ghost"
          onClick={onOpenFilter}
          aria-label="Filter meetings"
          className={isFilterOpen ? 'bg-black/5' : ''}
          icon={<Icon name="filter" className="h-5 w-5" />}
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

          <div className="flex flex-col gap-4 p-4">
            <Input
              variant="date"
              value={draftFilterDate}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onDraftFilterDateChange(event.target.value)
              }
            />

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
      renderLeft={(item) => {
        const descriptionPreview = getDescriptionPreview(item.description);

        return (
          <div className="flex min-w-0 items-start gap-6">
            <span className="w-24 shrink-0 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-[#3d5f46]/50">
              {item.dateLabel}
            </span>
            <div className="min-w-0">
              <span className="block truncate text-base font-semibold text-[#1f2937]">{item.title}</span>
              {descriptionPreview ? (
                <span className="mt-0.5 block text-xs font-medium leading-5 text-[#1f2937]/50">
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
          <div className="grid grid-cols-[auto_auto_auto] items-center gap-x-3 gap-y-1">
            <span className="whitespace-nowrap rounded-full border border-[#d5c9b6]/70 bg-[#f6f1e8] px-2.5 py-0.5 text-[10px] font-semibold text-[#2F3A3A]/80">
              {attendeesLabel}
            </span>
            <span className="row-start-2 whitespace-nowrap rounded-full border border-[#d5c9b6]/70 bg-[#f6f1e8] px-2.5 py-0.5 text-[10px] font-semibold text-[#2F3A3A]/80">
              {actionItemsLabel}
            </span>
            <div className="row-start-2 col-start-2 flex items-center">
              <StatusDot status={item.status} />
            </div>
            <div className="row-start-2 col-start-3 flex items-center">
              <Button
                variant="icon-ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onInfoClick(item.id);
                }}
                aria-label="Meeting details"
                className="h-8 w-8"
                icon={<Icon name="info" className="h-5 w-5" />}
              />
            </div>
          </div>
        );
      }}
    />
  );
};

export default MeetingList;
