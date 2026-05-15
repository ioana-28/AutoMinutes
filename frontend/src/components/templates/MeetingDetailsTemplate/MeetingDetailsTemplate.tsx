import { FC } from 'react';
import MeetingDetailsHeader from '@molecules/MeetingDetailsHeader/MeetingDetailsHeader';
import MeetingSummaryActions from '@molecules/MeetingSummaryActions/MeetingSummaryActions';
import MeetingDetailsBody from '@organisms/Meeting/MeetingDetailsBody/MeetingDetailsBody';
import { IMeetingDetailsTemplateProps } from './IMeetingDetailsTemplate';

const MeetingDetailsTemplate: FC<IMeetingDetailsTemplateProps> = ({
  meetingTitle,
  meetingDateLabel,
  isEditingTitle,
  editTitleValue,
  editDateValue,
  isSaving: _isSaving = false,
  layout = 'page',
  onEditTitleValueChange,
  onEditDateValueChange,
  onToggleEditTitle,
  onSave,
  onDelete,
  onClose,
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-[#a8c3b0] bg-[#f6f1e8] shadow-[0_16px_40px_-24px_rgba(15,23,42,0.45)]">
      <MeetingDetailsHeader
        meetingTitle={meetingTitle}
        meetingDateLabel={meetingDateLabel}
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
          onParticipants={onParticipants}
          onActionItems={onActionItems}
        />
        
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[#7f9d86]/20 bg-[#efebe2] p-4 shadow-sm">
          {rightSlot}
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default MeetingDetailsTemplate;
