import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import StatusDot from '@atoms/StatusDot/StatusDot';
import MeetingDetailsHeader from '@molecules/MeetingDetailsHeader/MeetingDetailsHeader';
import MeetingSummaryActions from '@molecules/MeetingSummaryActions/MeetingSummaryActions';
import MeetingDetailsBody from '@organisms/Meeting/MeetingDetailsBody/MeetingDetailsBody';
import { IMeetingDetailsTemplateProps } from './IMeetingDetailsTemplate';

const MeetingDetailsTemplate: FC<IMeetingDetailsTemplateProps> = ({
  meetingTitle,
  meetingDateLabel,
  status,
  isEditingTitle,
  editTitleValue,
  editDateValue,
  isSaving: _isSaving = false,
  layout = 'page',
  activeView = 'overview',
  onEditTitleValueChange,
  onEditDateValueChange,
  onToggleEditTitle,
  onSave,
  onDelete,
  onClose,
  onOverview,
  onParticipants,
  onActionItems,
  rightSlot,
  children,
}) => {
  return layout === 'page' ? (
    <main className="min-h-screen bg-[#cad2c5]">
      <MeetingDetailsHeader
        meetingTitle={meetingTitle}
        meetingDateLabel={meetingDateLabel}
        status={status}
        isEditingTitle={isEditingTitle}
        editTitleValue={editTitleValue}
        editDateValue={editDateValue}
        layout="page"
        onEditTitleValueChange={onEditTitleValueChange}
        onEditDateValueChange={onEditDateValueChange}
        onToggleEditTitle={onToggleEditTitle}
        onSave={onSave}
        onDelete={onDelete}
        onClose={onClose}
      />

      <MeetingDetailsBody
        leftSlot={
          <div className="flex w-full flex-col gap-6">
            <MeetingSummaryActions
              activeView={activeView}
              onOverview={onOverview}
              onParticipants={onParticipants}
              onActionItems={onActionItems}
            />
            {children}
          </div>
        }
        rightSlot={rightSlot ?? null}
      />
    </main>
  ) : (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-l border-[#7f9d86]/30 bg-[#f6f1e8]">
      <MeetingDetailsHeader
        meetingTitle={meetingTitle}
        meetingDateLabel={meetingDateLabel}
        status={status}
        isEditingTitle={isEditingTitle}
        editTitleValue={editTitleValue}
        editDateValue={editDateValue}
        layout="panel"
        onEditTitleValueChange={onEditTitleValueChange}
        onEditDateValueChange={onEditDateValueChange}
        onToggleEditTitle={onToggleEditTitle}
        onSave={onSave}
        onDelete={onDelete}
        onClose={onClose}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-5 py-4">
        <MeetingSummaryActions
          activeView={activeView}
          onOverview={onOverview}
          onParticipants={onParticipants}
          onActionItems={onActionItems}
        />

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              label="Generate Summary"
              variant="generate-summary"
              onClick={() => undefined}
              aria-label="Generate summary"
              icon={<Icon name="bolt" className="h-3.5 w-3.5" />}
            />
            <Button
              label="Reprocess"
              variant="reprocess"
              onClick={() => undefined}
              aria-label="Reprocess meeting"
              icon={<Icon name="refresh" className="h-3.5 w-3.5" />}
            />
          </div>

          <div className="flex items-center gap-2 px-2">
            <StatusDot status={status} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3d5f46]/60">
              {status}
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[#7f9d86]/20 bg-[#efebe2] p-4 shadow-sm">
          {rightSlot}
        </div>

        {children}
      </div>
    </div>
  );
};

export default MeetingDetailsTemplate;
