import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import ListRow from '@molecules/List Rows/ListRow/ListRow';
import { IAttendeeListItemProps } from './IAttendeeListItem';

const AttendeeListItem: FC<IAttendeeListItemProps> = ({
  displayName,
  isSaving,
  isDeleting,
  onDelete,
}) => {
  const leftSlot = <span className="text-sm font-semibold text-[#1f2937]">{displayName}</span>;

  const rightSlot = (
    <Button
      variant="icon-delete"
      onClick={onDelete}
      aria-label={`Delete attendee ${displayName}`}
      className="h-7 w-7 border border-[#d68f8f]"
      icon={<Icon name="trash" className="h-3.5 w-3.5" />}
      disabled={isDeleting || isSaving}
    />
  );

  return <ListRow variant="pill" leftSlot={leftSlot} rightSlot={rightSlot} />;
};

export default AttendeeListItem;
