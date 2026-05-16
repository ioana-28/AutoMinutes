import { FC } from 'react';
import Navbar from '@molecules/Navbar/Navbar';
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
  const handleMeetingListClick = () => {
    onNavigateMeetingList();
  };

  const handleToDoListClick = () => {
    onNavigateToDoList();
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#cad2c5]">
      <Navbar
        leftSlot={
          <>
            <Button
              label="Meeting List"
              variant={activePage === 'meeting-list' ? 'nav-active' : 'nav'}
              onClick={handleMeetingListClick}
            />
            <Button
              label="To Do List"
              variant={activePage === 'to-do-list' ? 'nav-active' : 'nav'}
              onClick={handleToDoListClick}
            />
            {/* <Button
              label="ADMIN"
              variant={activePage === 'admin' ? 'nav-active' : 'nav'}
              onClick={handleAdminClick}
            /> */}
          </>
        }
        rightSlot={addMeetingSlot ?? null}
      />

      <section className={`flex min-h-0 flex-1 flex-col ${contentClassName ?? 'p-4'}`.trim()}>
        <div className="flex min-h-0 flex-1 flex-col">
          {toolbarSlot ? <div className="mb-4 flex w-full flex-col">{toolbarSlot}</div> : null}
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </section>
    </main>
  );
};

export default MeetingLayoutTemplate;
