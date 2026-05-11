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
      panelClassName="max-w-[360px] min-h-0 rounded-[22px] border-[3px] border-[#1e3522] bg-[#386641] shadow-[0_22px_45px_rgba(0,0,0,0.28)]"
    >
      <div className="relative flex items-center justify-center px-3 pb-1.5 pt-3">
        <h2
          id="attendees-list-title"
          className="m-0 rounded-full bg-[#f5f5f2] px-5 py-1 text-sm font-extrabold tracking-[0.08em] text-[#1a1a1a]"
        >
          ATTENDEES LIST
        </h2>
        <Button
          variant="icon-close"
          onClick={onClose}
          aria-label="Close attendees popup"
          className="absolute right-3 top-2.5 h-11 w-11 border border-[#f8b2b2] bg-[#2f5538] text-[#ffd0d0] shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
          icon={<Icon name="close" className="h-7 w-7" />}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-2">
        {demoAttendees.map((attendee) => (
          <div
            key={attendee}
            className="flex items-center justify-between rounded-full border border-[#6e8f76] bg-[#efebe2] px-3.5 py-1.5"
          >
            <span className="text-sm font-semibold text-[#1f2937]">{attendee}</span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="icon-ghost"
                onClick={() => undefined}
                aria-label={`Edit attendee ${attendee}`}
                className="h-7 w-7"
                icon={<Icon name="edit" className="h-3.5 w-3.5" />}
              />
              <Button
                variant="icon-delete"
                onClick={() => undefined}
                aria-label={`Delete attendee ${attendee}`}
                className="h-7 w-7"
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
