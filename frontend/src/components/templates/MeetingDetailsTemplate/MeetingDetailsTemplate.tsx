import { FC } from 'react';
import MeetingDetailsHeader from '@molecules/MeetingDetailsHeader/MeetingDetailsHeader';
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

      <section className="mx-auto w-full max-w-[1200px] p-6">{children}</section>
    </main>
  );
};

export default MeetingDetailsTemplate;
