import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Popup from '@atoms/Popup/Popup';
import { AttendeeConfirmationDialog } from '@molecules/ConfirmationDialog/ConfirmationDialog';
import AddAttendeeSection from '@organisms/Atendees/AddAttendeeSection/AddAttendeeSection';
import AttendeeList from '@organisms/Atendees/AttendeeList/AttendeeList';
import useAttendeeListLogic from '@/hooks/useAttendeeListLogic';
import { IAttendeesListPopupProps } from './IAttendeesListPopup';

const AttendeesListPopup: FC<IAttendeesListPopupProps> = ({ isOpen, ...props }) => {
  const { addAttendeeControls, addAttendeeProps, listProps, deleteDialogProps, popupActions } =
    useAttendeeListLogic(props);

  return (
    <>
      <Popup
        isOpen={isOpen}
        titleId="attendees-list-title"
        variant="confirm"
        panelClassName="flex h-[500px] w-[720px] max-w-[720px] flex-col [&>div]:min-h-0"
      >
        <div className="relative flex items-center justify-end gap-2 px-4 pt-4">
          <h2   className="bg-transparent">
            Participants List</h2>

          <Button
            variant="add"
            onClick={addAttendeeControls.onOpenAddParticipant}
            aria-label="Add attendee"
            label="+"
            disabled={addAttendeeControls.isAddingParticipant}
          />

          <Button
            variant="icon-close"
            onClick={popupActions.onClose}
            aria-label="Close attendees popup"
            icon={<Icon name="close" className="h-6 w-6" />}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-4">
          {addAttendeeControls.isAddingParticipant ? <AddAttendeeSection {...addAttendeeProps} /> : null}

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <AttendeeList {...listProps} />
          </div>
        </div>
      </Popup>

      <AttendeeConfirmationDialog {...deleteDialogProps} />
    </>
  );
};

export default AttendeesListPopup;