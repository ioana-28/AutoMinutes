import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Popup from '@atoms/Popup/Popup';
import { AttendeeConfirmationDialog } from '@molecules/ConfirmationDialog/ConfirmationDialog';
import AddAttendeeSection from '@organisms/Atendees/AddAttendeeSection/AddAttendeeSection';
import AttendeeList from '@organisms/Atendees/AttendeeList/AttendeeList';
import useAttendeeListLogic from '@/hooks/useAttendeeListLogic';
import { IAttendeesListPopupProps } from './IAttendeesListPopup';

const AttendeesListPopup: FC<IAttendeesListPopupProps> = ({ isOpen, ...props }) => {
  const { addAttendeeControls, addAttendeeProps, listProps, deleteDialogProps } =
    useAttendeeListLogic(props);

  const isPanel = props.variant === 'panel';
  const subComponentVariant = isPanel ? 'panel' : 'default';

  const content = (
    <>
      <div className="flex items-center justify-between gap-2 border-b border-[#7f9d86]/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#3d5f46]">
            Participants List
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="add"
            onClick={addAttendeeControls.onOpenAddParticipant}
            aria-label="Add attendee"
            label="+"
            disabled={addAttendeeControls.isAddingParticipant}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-4 pt-3">
        {addAttendeeControls.isAddingParticipant ? (
          <AddAttendeeSection {...addAttendeeProps} variant={subComponentVariant} />
        ) : null}

        <AttendeeList {...listProps} variant={subComponentVariant} />
      </div>
    </>
  );

  return isPanel ? (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#7f9d86]/20 bg-[#f6f1e8] shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]">
      {content}
      <AttendeeConfirmationDialog {...deleteDialogProps} />
    </div>
  ) : (
    <>
      <Popup
        isOpen={isOpen}
        titleId="attendees-list-title"
        variant="confirm"
        panelClassName="flex h-[500px] w-[720px] max-w-[720px] flex-col [&>div]:min-h-0"
      >
        {content}
      </Popup>

      <AttendeeConfirmationDialog {...deleteDialogProps} />
    </>
  );
};

export default AttendeesListPopup;
