import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Popup from '@atoms/Popup/Popup';
import { IAttendeesListPopupProps } from './IAttendeesListPopup';

const demoAttendees = [
  'Alice Johnson',
  'Mihai Popescu',
  'Elena Ionescu',
  'Radu Marin',
  'Sofia Dumitrescu',
];

const AttendeesListPopup: FC<IAttendeesListPopupProps> = ({ isOpen, onClose }) => {
  return (
    <Popup
      isOpen={isOpen}
      titleId="attendees-list-title"
      variant="confirm"
panelClassName="w-[820px] max-w-[820px] rounded-[10px] border-[3px] border-[#1e3522] bg-[#386641] shadow-[0_22px_45px_rgba(0,0,0,0.28)]"
    >
      <div className="relative flex justify-center px-14 pb-3 pt-4">
        <h2
          id="attendees-list-title"
          className="m-0 rounded-full bg-[#f5f5f2] px-20 py-1.5 text-center text-sm font-extrabold tracking-[0.08em] text-[#1a1a1a]"
        >
          ATTENDEES LIST
        </h2>

        <Button
          variant="icon-close"
          onClick={onClose}
          aria-label="Close attendees popup"
          className="absolute right-3 top-5 h-8 w-8 border-none bg-transparent text-[#ffb6b6] shadow-none"
          icon={<Icon name="close" className="h-6 w-6" />}
        />
      </div>

      <div className="flex flex-col gap-2 px-5 pb-4 pt-1">
        {demoAttendees.map((attendee) => (
          <div
            key={attendee}
            className="flex items-center justify-between rounded-full border-[2px] border-[#1e3522] bg-[#efebe2] px-5 py-1"
          >
            <span className="text-sm font-semibold text-[#1f2937]">
              {attendee}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="icon-ghost"
                onClick={() => undefined}
                aria-label={`Edit attendee ${attendee}`}
                className="h-7 w-7 border border-[#8aa08d]"
                icon={<Icon name="edit" className="h-3.5 w-3.5" />}
              />

              <Button
                variant="icon-delete"
                onClick={() => undefined}
                aria-label={`Delete attendee ${attendee}`}
                className="h-7 w-7 border border-[#d68f8f]"
                icon={<Icon name="trash" className="h-3.5 w-3.5" />}
              />
            </div>
          </div>
        ))}
      </div>
    </Popup>
  );
};

export default AttendeesListPopup;