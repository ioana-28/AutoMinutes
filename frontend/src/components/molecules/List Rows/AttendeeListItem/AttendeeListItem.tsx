import { ChangeEvent, FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import ListRow from '@molecules/List Rows/ListRow/ListRow';
import { IAttendeeListItemProps } from './IAttendeeListItem';

const AttendeeListItem: FC<IAttendeeListItemProps> = ({
  displayName,
  isEditing,
  isSaving,
  isDeleting,
  editValue,
  onEditValueChange,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
}) => {
  const leftSlot = isEditing ? (
    <div className="mr-3 flex-1">
      <Input
        value={editValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onEditValueChange(event.target.value)}
        className="rounded-full border border-[#7f9d86] bg-[#f8f6f1] px-3 py-1 text-sm font-semibold text-[#1f2937] outline-none focus:border-[#386641]"
        aria-label={`Edit full name for ${displayName}`}
      />
    </div>
  ) : (
    <span className="text-sm font-semibold text-[#1f2937]">{displayName}</span>
  );

  const rightSlot = isEditing ? (
    <>
      <Button
        variant="icon-ghost"
        onClick={onSave}
        aria-label={`Save attendee ${displayName}`}
        className="h-7 w-7 border border-[#8aa08d]"
        icon={<Icon name="save" className="h-3.5 w-3.5" />}
        disabled={isSaving || !editValue.trim()}
      />
      <Button
        variant="icon-close"
        onClick={onCancelEdit}
        aria-label={`Cancel editing attendee ${displayName}`}
        className="h-7 w-7 border-none bg-transparent text-[#d88f8f] shadow-none"
        icon={<Icon name="close" className="h-4 w-4" />}
        disabled={isSaving}
      />
    </>
  ) : (
    <>
      <Button
        variant="icon-ghost"
        onClick={onStartEdit}
        aria-label={`Edit attendee ${displayName}`}
        className="h-7 w-7 border border-[#8aa08d]"
        icon={<Icon name="edit" className="h-3.5 w-3.5" />}
        disabled={isDeleting || isSaving}
      />
      <Button
        variant="icon-delete"
        onClick={onDelete}
        aria-label={`Delete attendee ${displayName}`}
        className="h-7 w-7 border border-[#d68f8f]"
        icon={<Icon name="trash" className="h-3.5 w-3.5" />}
        disabled={isDeleting || isSaving}
      />
    </>
  );

  return <ListRow variant="pill" leftSlot={leftSlot} rightSlot={rightSlot} />;
};

export default AttendeeListItem;
