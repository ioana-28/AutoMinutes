import { ChangeEvent, FC } from 'react';
import Button from '@atoms/Button/Button';
import Input from '@atoms/Input/Input';
import Navbar from '@organisms/Navbar/Navbar';
import { IMeetingDetailsTemplateProps } from './IMeetingDetailsTemplate';

const MeetingDetailsTemplate: FC<IMeetingDetailsTemplateProps> = ({
  meetingTitle,
  isEditingTitle,
  editTitleValue,
  isSaving: _isSaving = false,
  onEditTitleValueChange,
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
          <>
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

            <Button
              label={'DELETE'}
              variant="nav"
              onClick={onDelete}
              className="min-w-[110px] border-[#513030] bg-[#e0b7b7] text-[#2e1111] hover:bg-[#d8a9a9]"
            />
          </>
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
                <h1 className="text-center text-xl font-semibold text-[#0f1a0f]">{meetingTitle}</h1>
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
