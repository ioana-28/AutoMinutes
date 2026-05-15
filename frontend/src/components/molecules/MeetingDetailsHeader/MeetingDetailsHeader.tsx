import { ChangeEvent, FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import Navbar from '@molecules/Navbar/Navbar';
import { IMeetingDetailsHeaderProps } from './IMeetingDetailsHeader';

const MeetingDetailsHeader: FC<IMeetingDetailsHeaderProps> = ({
  meetingTitle,
  meetingDateLabel,
  isEditingTitle,
  editTitleValue,
  editDateValue,
  layout = 'page',
  onEditTitleValueChange,
  onEditDateValueChange,
  onToggleEditTitle,
  onSave,
  onDelete,
  onClose,
}) => (
  layout === 'page' ? (
    <Navbar
      leftSlot={
        <div className="flex items-center gap-2">
          <Button
            variant="icon-delete"
            onClick={onDelete}
            aria-label="Delete meeting"
            className="h-10 w-10"
            icon={<Icon name="trash" className="h-5 w-5" />}
          />
          <Button
            variant="icon-ghost"
            onClick={onSave}
            aria-label="Save meeting"
            className="h-10 w-10"
            icon={<Icon name="save" className="h-5 w-5" />}
          />
          <Button
            variant="icon-ghost"
            onClick={onToggleEditTitle}
            aria-label="Edit meeting title"
            className="h-10 w-10"
            icon={<Icon name="edit" className="h-5 w-5" />}
          />
        </div>
      }
      rightSlot={
        <>
          <div className="flex flex-1 items-center justify-center">
            {isEditingTitle ? (
              <Input
                value={editTitleValue}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onEditTitleValueChange(event.target.value)
                }
                className="max-w-[420px]"
              />
            ) : (
              <h1 className="mr-7 rounded-xl bg-surface-alt px-4 py-1 text-center text-2xl font-bold text-text-heading">
                {meetingTitle}
              </h1>
            )}
          </div>

          <div className="ml-4">
            {isEditingTitle ? (
              <Input
                variant="date"
                value={editDateValue}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onEditDateValueChange(event.target.value)
                }
                className="max-w-[220px]"
              />
            ) : (
              <span className="rounded-full border border-border-muted px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-text-primary">
                {meetingDateLabel}
              </span>
            )}
          </div>

          <Button
            variant="icon-close"
            onClick={onClose}
            aria-label="Close meeting"
            icon={<Icon name="close" className="h-[28px] w-[28px]" />}
          />
        </>
      }
    />
  ) : (
    <header className="flex w-full items-center justify-between gap-4 border-b border-[#7f9d86]/20 bg-[#efebe2] px-6 py-3">
      <div className="flex items-center gap-1.5">
        <Button
          variant="icon-ghost"
          onClick={onToggleEditTitle}
          aria-label="Edit meeting title"
          className="h-8 w-8"
          icon={<Icon name="edit" className="h-4 w-4" />}
        />
        <Button
          variant="icon-ghost"
          onClick={onSave}
          aria-label="Save meeting"
          className="h-8 w-8"
          icon={<Icon name="save" className="h-4 w-4" />}
        />
        <Button
          variant="icon-delete"
          onClick={onDelete}
          aria-label="Delete meeting"
          className="h-8 w-8"
          icon={<Icon name="trash" className="h-4 w-4" />}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center">
        {isEditingTitle ? (
          <Input
            value={editTitleValue}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onEditTitleValueChange(event.target.value)
            }
            className="max-w-[280px]"
          />
        ) : (
          <h1 className="truncate text-base font-bold text-[#1f2937]">
            {meetingTitle}
          </h1>
        )}
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#3d5f46]/60">
          {meetingDateLabel}
        </span>
      </div>

      <Button
        variant="icon-close"
        onClick={onClose}
        aria-label="Close meeting"
        className="h-8 w-8"
        icon={<Icon name="close" className="h-5 w-5" />}
      />
    </header>
  )
);

export default MeetingDetailsHeader;
