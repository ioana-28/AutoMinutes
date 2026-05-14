import { ChangeEvent, FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Popup from '@atoms/Popup/Popup';
import Select from '@atoms/Select/Select';
import StatusDot from '@atoms/StatusDot/StatusDot';
import GenericList from '@molecules/GenericList/GenericList';
import { IMeetingListProps, IMeetingListToolbarProps, MeetingListItem } from './IMeetingList';

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
}) => (
  <div className="flex flex-wrap items-center gap-3">
    <div className="relative">
      <Button
        variant="icon-ghost"
        onClick={onOpenFilter}
        aria-label="Filter meetings"
        icon={<Icon name="filter" className="h-5 w-5" />}
      />

      <Popup
        isOpen={isFilterOpen}
        titleId="meeting-filter-title"
        variant="popover"
        overlayClassName="left-0 top-full mt-2"
      >
        <div className="flex items-center justify-between gap-2">
          <span
            id="meeting-filter-title"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3d5f46]"
          >
            Filters
          </span>
          <Button
            variant="icon-close"
            onClick={onCloseFilter}
            aria-label="Close filter popup"
            className="h-8 w-8"
            icon={<Icon name="close" className="h-4 w-4" />}
          />
        </div>

        <Input
          variant="date"
          value={draftFilterDate}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onDraftFilterDateChange(event.target.value)
          }
        />

        <div className="flex flex-wrap gap-2">
          <Button label="Clear" variant="nav" onClick={onClearFilter} className="flex-1" />
          <Button label="Apply" variant="nav" onClick={onApplyFilter} className="flex-1" />
        </div>
      </Popup>
    </div>

    <div className="min-w-[220px] flex-1">
      <Input
        value={searchTerm}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchTermChange(event.target.value)}
        placeholder="Search meetings..."
      />
    </div>

    <div className="min-w-[190px]">
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

const MeetingList: FC<IMeetingListProps> = ({
  isLoading,
  error,
  items,
  expandedId,
  onToggleExpand,
  onInfoClick,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-[#7f9d86] bg-[#efebe2] p-10 text-center text-[#1f2937]">
        Loading meetings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[#b33a3a] bg-[#f4c7c7] p-6 text-center text-[#6b1f1f]">
        {error}
      </div>
    );
  }

  return (
    <GenericList<MeetingListItem>
      items={items}
      getItemId={(item) => item.id}
      expandedId={expandedId}
      onToggleExpand={(id) => onToggleExpand(id as number)}
      emptyMessage="No meetings found."
      renderLeft={(item) => (
        <div className="flex min-w-0 flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d5f46]">
            {item.dateLabel}
          </span>
          <span className="truncate text-lg font-semibold text-[#1f2937]">{item.title}</span>
        </div>
      )}
      renderRight={(item) => (
        <div className="flex items-center gap-3">
          <StatusDot status={item.status} />
          <Button
            variant="icon-ghost"
            onClick={() => onInfoClick(item.id)}
            aria-label="Meeting details"
            className="h-9 w-9"
            icon={<Icon name="info" className="h-5 w-5" />}
          />
        </div>
      )}
      renderExpanded={(item) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-[#1f2937]">
            {item.description || 'No description available yet.'}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4a5d50]">
            Status: {item.status}
          </p>
        </div>
      )}
    />
  );
};

export default MeetingList;
