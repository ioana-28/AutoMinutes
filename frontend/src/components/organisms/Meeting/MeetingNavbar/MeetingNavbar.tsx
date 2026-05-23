import { FC, useEffect, useRef, useState } from 'react';
import Navbar from '@molecules/Navbar/Navbar';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import { IMeetingNavbarProps } from './IMeetingNavbar';

const MeetingNavbar: FC<IMeetingNavbarProps> = ({
  activePage,
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

  const userEmail = localStorage.getItem('userEmail');

  return (
    <Navbar
      leftSlot={
        <>
          <Button
            label="Meeting List"
            variant={activePage === 'meeting-list' ? 'nav-active' : 'nav'}
            onClick={onNavigateMeetingList}
          />
          <Button
            label="To Do List"
            variant={activePage === 'to-do-list' ? 'nav-active' : 'nav'}
            onClick={onNavigateToDoList}
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
              <div className="absolute right-0 top-full z-[1000] mt-2 w-48 transform rounded-2xl border border-[#386641]/10 bg-[#efebe2] p-3 shadow-[0_15px_50px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in duration-200">
                {userEmail && (
                  <div
                    className="mb-2 truncate border-b border-[#386641]/10 px-2 pb-2 pt-1.5 text-[11px] font-medium text-[#386641]/70"
                    title={userEmail}
                  >
                    {userEmail}
                  </div>
                )}

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
  );
};

export default MeetingNavbar;
