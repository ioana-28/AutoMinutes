import { ChangeEvent, FC } from 'react';
import Button from '@atoms/Button/Button';
import Input from '@atoms/Input/Input';
import Navbar from '@organisms/Navbar/Navbar';
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
      <Navbar
        leftSlot={
          <div className="flex items-center gap-2">
            <Button
              variant="icon-delete"
              onClick={onDelete}
              aria-label="Delete meeting"
              className="h-10 w-10 "
              icon={
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M3 6h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 6v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 11v6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 11v6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <Button
              variant="icon-ghost"
              onClick={onSave}
              aria-label="Save meeting"
              className="h-10 w-10"
              icon={
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 21V13H7v8M7 3v5h8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />

            <Button
              variant="icon-ghost"
              onClick={onToggleEditTitle}
              aria-label="Edit meeting title"
              className="h-10 w-10"
              icon={
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M12 20h9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />

            
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
                <h1 className="rounded-xl mr-7 px-4 py-1 text-center text-2xl font-bold text-[#0f1a0f]">
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
                <span className="rounded-full border border-[#7f9d86]  px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1f2937]">
                  {meetingDateLabel}
                </span>
              )}
            </div>

            <Button
              variant="icon-close"
              onClick={onClose}
              aria-label="Close meeting"
              icon={
                <svg
                  className="h-[28px] w-[28px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </>
        }
      />

      <section className="mx-auto w-full max-w-[1200px] p-6">{children}</section>
    </main>
  );
};

export default MeetingDetailsTemplate;
