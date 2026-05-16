import { FC, useEffect, useState, useRef } from 'react';
import Navbar from '@molecules/Navbar/Navbar';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import { IMeetingLayoutTemplateProps } from './IMeetingLayoutTemplate';

const MeetingLayoutTemplate: FC<IMeetingLayoutTemplateProps> = ({
  activePage,
  children,
  contentClassName,
  toolbarSlot,
  addMeetingSlot,
  onLogout,
  onNavigateMeetingList,
  onNavigateToDoList,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          </>
        }
        rightSlot={
          <div className="flex items-center gap-3">
            {addMeetingSlot ?? null}
            <div className="relative ml-10" ref={profileRef}>
              <Button
                icon={<Icon name="user" className="h-6 w-6" />}
                variant="icon-ghost"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                title="Profile"
                className={`transition-all ${isProfileOpen ? 'bg-white/10 text-[#f6f2ea]' : 'text-[#f6f2ea]'}`}
              />

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 transform rounded-2xl border border-[#386641]/10 bg-[#efebe2] p-3 shadow-[0_15px_50px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in duration-200">
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#386641] px-4 py-3 text-xs font-bold text-[#a4c3b2] transition-all hover:bg-[#2f5737] hover:shadow-md active:scale-[0.98]"
                  >
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        }
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
