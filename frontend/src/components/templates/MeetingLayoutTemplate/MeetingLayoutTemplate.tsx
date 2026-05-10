import { FC, MouseEventHandler } from 'react';
import Navbar from '@organisms/Navbar/Navbar';
import Button from '@atoms/Button/Button';
import { IMeetingLayoutTemplateProps } from './IMeetingLayoutTemplate';

const MeetingLayoutTemplate: FC<IMeetingLayoutTemplateProps> = ({
  activePage,
  children,
  contentClassName,
  toolbarSlot,
  addMeetingSlot,
  onNavigateMeetingList,
  onNavigateToDoList,
}) => {
  const handleMeetingListClick: MouseEventHandler<HTMLButtonElement> = () => {
    onNavigateMeetingList();
  };

  const handleToDoListClick: MouseEventHandler<HTMLButtonElement> = () => {
    onNavigateToDoList();
  };

  return (
    <main className="min-h-screen bg-[#cad2c5]">
      <Navbar
        leftSlot={
          <>
            <Button
              label="MEETING LIST"
              variant={activePage === 'meeting-list' ? 'nav-active' : 'nav'}
              onClick={handleMeetingListClick}
            />
            <Button
              label="TO DO LIST"
              variant={activePage === 'to-do-list' ? 'nav-active' : 'nav'}
              onClick={handleToDoListClick}
            />
          </>
        }
        rightSlot={
          addMeetingSlot ?? null
        }
      />

      <section className={`mx-auto w-full p-6 ${contentClassName ?? 'max-w-[1200px]'}`.trim()}>
        <div className="flex w-full flex-col gap-6">
          {toolbarSlot ? <div className="flex w-full flex-col">{toolbarSlot}</div> : null}
          {children}
        </div>
      </section>
    </main>
  );
};

export default MeetingLayoutTemplate;
