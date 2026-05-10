import { ChangeEvent, FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Popup from '@atoms/Popup/Popup';
import Select from '@atoms/Select/Select';
import StatusDot from '@atoms/StatusDot/StatusDot';
import ListRow from '@molecules/ListRow/ListRow';
import { IMeetingListProps, IMeetingListToolbarProps, MeetingListItem } from './IMeetingList';

export const MeetingListToolbar: FC<IMeetingListToolbarProps> = ({
  searchTerm,
  sortKey,
  isFilterOpen,
  draftFilterDate,
  onSearchTermChange,
  onSortKeyChange,
  onOpenFilter,
  onCloseFilter,
  onApplyFilter,
  onClearFilter,
  onDraftFilterDateChange,
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

const MeetingListRow: FC<{
  item: MeetingListItem;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  onInfoClick: (id: number) => void;
}> = ({ item, isExpanded, onToggleExpand, onInfoClick }) => {
  const detailsId = `meeting-details-${item.id}`;

  return (
    <div className="rounded-2xl border border-[#7f9d86] bg-[#f6f1e8] px-5 py-4 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.45)]">
      <ListRow
        className="gap-6"
        leftSlot={
          <div className="flex min-w-0 items-center gap-4">
            <Button
              variant="icon-ghost"
              onClick={() => onToggleExpand(item.id)}
              aria-expanded={isExpanded}
              aria-controls={detailsId}
              className="h-9 w-9"
              icon={
                <Icon
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  className="h-5 w-5"
                />
              }
            />

            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d5f46]">
                {item.dateLabel}
              </span>
              <span className="truncate text-lg font-semibold text-[#1f2937]">{item.title}</span>
            </div>
          </div>
        }
        rightSlot={
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
        }
      />

      {isExpanded ? (
        <div
          id={detailsId}
          className="mt-4 rounded-xl border border-[#c7e8cd] bg-[#edf3ea] px-4 py-3 text-sm text-[#1f2937]"
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm text-[#1f2937]">
              {item.description || 'No description available yet.'}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4a5d50]">
              Status: {item.status}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

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

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#7f9d86] bg-[#efebe2] p-10 text-center text-[#1f2937]">
        No meetings found.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {items.map((item) => (
        <MeetingListRow
          key={item.id}
          item={item}
          isExpanded={expandedId === item.id}
          onToggleExpand={onToggleExpand}
          onInfoClick={onInfoClick}
        />
      ))}
    </div>
  );
};

export default MeetingList;
