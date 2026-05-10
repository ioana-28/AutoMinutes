import { FC } from 'react';
import MeetingDetailsHeader from '@molecules/MeetingDetailsHeader/MeetingDetailsHeader';
import MeetingSummaryActions from '@molecules/MeetingSummaryActions/MeetingSummaryActions';
import MeetingDetailsBody from '@organisms/MeetingDetailsBody/MeetingDetailsBody';
import { IMeetingDetailsTemplateProps } from './IMeetingDetailsTemplate';

const MeetingDetailsTemplate: FC<IMeetingDetailsTemplateProps> = ({
  meetingTitle,
  meetingDateLabel,
  isEditingTitle,
  editTitleValue,
  editDateValue,
  isSaving: _isSaving = false,
  onEditTitleValueChange,
  onEditDateValueChange,
  onToggleEditTitle,
  onSave,
  onDelete,
  onClose,
  onParticipants,
  onActionItems,
  children,
}) => {
  return (
    <main className="min-h-screen bg-[#cad2c5]">
      <MeetingDetailsHeader
        meetingTitle={meetingTitle}
        meetingDateLabel={meetingDateLabel}
        isEditingTitle={isEditingTitle}
        editTitleValue={editTitleValue}
        editDateValue={editDateValue}
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
        rightSlot={null}
      />
    </main>
  );
};

export default MeetingDetailsTemplate;
