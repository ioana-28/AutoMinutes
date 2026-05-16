import { ChangeEvent, FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Input from '@atoms/Input/Input';
import StatusDot from '@atoms/StatusDot/StatusDot';
import Navbar from '@molecules/Navbar/Navbar';
import { IMeetingDetailsHeaderProps } from './IMeetingDetailsHeader';

const MeetingDetailsHeader: FC<IMeetingDetailsHeaderProps> = ({
  meetingTitle,
  meetingDateLabel,
  status,
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
}) =>
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
            label="Generate Summary"
            variant="generate-summary"
            onClick={() => undefined}
            aria-label="Generate summary"
            icon={<Icon name="bolt" className="h-4 w-4" />}
          />
          <Button
            label="Reprocess"
            variant="reprocess"
            onClick={() => undefined}
            aria-label="Reprocess meeting"
            icon={<Icon name="refresh" className="h-4 w-4" />}
          />
          <div className="flex items-center gap-2 px-3 border-l border-white/20 ml-2">
            <StatusDot status={status} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
              {status}
            </span>
          </div>
          <Button
            variant="icon-ghost"
            onClick={onToggleEditTitle}
            aria-label="Edit meeting title"
            className="h-10 w-10"
            icon={<Icon name="edit" className="h-5 w-5" />}
          />
          {isEditingTitle && (
            <Button
              variant="icon-ghost"
              onClick={onSave}
              aria-label="Save meeting"
              className="h-10 w-10"
              icon={<Icon name="save" className="h-5 w-5" />}
            />
          )}
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
      <div className="flex min-w-0 flex-1 items-center justify-start gap-2">
        <Button
          variant="icon-ghost"
          onClick={onClose}
          aria-label="Back to meeting list"
          className="h-8 w-8"
          icon={<Icon name="back" className="h-4 w-4" />}
        />
        {isEditingTitle ? (
          <div className="flex items-center justify-start gap-2 w-full">
            <Input
              variant="compact"
              type="date"
              value={editDateValue}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onEditDateValueChange(event.target.value)
              }
              className="max-w-[140px]"
            />
            <Input
              variant="compact"
              value={editTitleValue}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onEditTitleValueChange(event.target.value)
              }
              className="max-w-[320px]"
            />
          </div>
        ) : (
          <div className="flex items-center justify-start gap-3 min-w-0">
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-[#3d5f46]/60">
              {meetingDateLabel}
            </span>
            <h1 className="truncate text-sm font-medium text-[#1f2937]">{meetingTitle}</h1>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          variant="icon-ghost"
          onClick={onToggleEditTitle}
          aria-label="Edit meeting title"
          className="h-8 w-8"
          icon={<Icon name="edit" className="h-4 w-4" />}
        />
        {isEditingTitle && (
          <Button
            variant="icon-ghost"
            onClick={onSave}
            aria-label="Save meeting"
            className="h-8 w-8"
            icon={<Icon name="save" className="h-4 w-4" />}
          />
        )}
        <Button
          variant="icon-delete"
          onClick={onDelete}
          aria-label="Delete meeting"
          className="h-8 w-8"
          icon={<Icon name="trash" className="h-4 w-4" />}
        />
      </div>
    </header>
  );

export default MeetingDetailsHeader;
