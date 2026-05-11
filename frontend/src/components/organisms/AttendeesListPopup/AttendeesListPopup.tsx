import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import Popup from '@atoms/Popup/Popup';
import { IAttendeesListPopupProps } from './IAttendeesListPopup';

const getParticipantDisplayName = (
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
) => {
  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
  if (fullName) {
    return fullName;
  }
  const fallbackEmail = email?.trim();
  return fallbackEmail || 'Unknown participant';
};

const AttendeesListPopup: FC<IAttendeesListPopupProps> = ({
  isOpen,
  onClose,
  participants,
  isLoadingParticipants,
  participantsError,
  deletingParticipantId,
  editingParticipantId,
  editParticipantNameValue,
  savingParticipantId,
  onStartEditParticipant,
  onEditParticipantNameValueChange,
  onCancelEditParticipant,
  onSaveEditParticipant,
  onDeleteParticipant,
}) => {
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
        {isLoadingParticipants ? (
          <div className="rounded-full border-[2px] border-[#1e3522] bg-[#efebe2] px-5 py-1 text-sm font-semibold text-[#1f2937]">
            Loading participants...
          </div>
        ) : participantsError ? (
          <div className="rounded-full border-[2px] border-[#8b3a3a] bg-[#f6d9d9] px-5 py-1 text-sm font-semibold text-[#6b1f1f]">
            {participantsError}
          </div>
        ) : participants.length === 0 ? (
          <div className="rounded-full border-[2px] border-[#1e3522] bg-[#efebe2] px-5 py-1 text-sm font-semibold text-[#1f2937]">
            No participants found.
          </div>
        ) : (
          participants.map((participant) => {
            const displayName = getParticipantDisplayName(
              participant.firstName,
              participant.lastName,
              participant.email,
            );
            const isEditingRow = editingParticipantId === participant.id;
            const isDeletingRow = deletingParticipantId === participant.id;
            const isSavingRow = savingParticipantId === participant.id;

            return (
              <div
                key={participant.id}
                className="flex items-center justify-between rounded-full border-[2px] border-[#1e3522] bg-[#efebe2] px-5 py-1"
              >
                {isEditingRow ? (
                  <input
                    type="text"
                    value={editParticipantNameValue}
                    onChange={(event) => onEditParticipantNameValueChange(event.target.value)}
                    className="mr-3 flex-1 rounded-full border border-[#7f9d86] bg-[#f8f6f1] px-3 py-1 text-sm font-semibold text-[#1f2937] outline-none focus:border-[#386641]"
                    aria-label={`Edit full name for ${displayName}`}
                  />
                ) : (
                  <span className="text-sm font-semibold text-[#1f2937]">{displayName}</span>
                )}

                <div className="flex items-center gap-2">
                  {isEditingRow ? (
                    <>
                      <Button
                        variant="icon-ghost"
                        onClick={() => onSaveEditParticipant(participant.id)}
                        aria-label={`Save attendee ${displayName}`}
                        className="h-7 w-7 border border-[#8aa08d]"
                        icon={<Icon name="save" className="h-3.5 w-3.5" />}
                        disabled={isSavingRow || !editParticipantNameValue.trim()}
                      />

                      <Button
                        variant="icon-close"
                        onClick={onCancelEditParticipant}
                        aria-label={`Cancel editing attendee ${displayName}`}
                        className="h-7 w-7 border-none bg-transparent text-[#d88f8f] shadow-none"
                        icon={<Icon name="close" className="h-4 w-4" />}
                        disabled={isSavingRow}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        variant="icon-ghost"
                        onClick={() => onStartEditParticipant(participant.id, displayName)}
                        aria-label={`Edit attendee ${displayName}`}
                        className="h-7 w-7 border border-[#8aa08d]"
                        icon={<Icon name="edit" className="h-3.5 w-3.5" />}
                        disabled={isDeletingRow || isSavingRow}
                      />

                      <Button
                        variant="icon-delete"
                        onClick={() => onDeleteParticipant(participant.id)}
                        aria-label={`Delete attendee ${displayName}`}
                        className="h-7 w-7 border border-[#d68f8f]"
                        icon={<Icon name="trash" className="h-3.5 w-3.5" />}
                        disabled={isDeletingRow || isSavingRow}
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Popup>
  );
};

export default AttendeesListPopup;