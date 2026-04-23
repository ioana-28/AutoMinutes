import { FC, MouseEventHandler, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@organisms/Navbar/Navbar';
import AddMeetingPopup from '@organisms/AddMeetingPopup/AddMeetingPopup';
import '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate.css';
import { IMeetingLayoutTemplateProps } from './IMeetingLayoutTemplate';

const MeetingLayoutTemplate: FC<IMeetingLayoutTemplateProps> = ({ activePage, children }) => {
  const navigate = useNavigate();
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);

  const handleMeetingListClick: MouseEventHandler<HTMLButtonElement> = () => {
    navigate('/meeting-list');
  };

  const handleToDoListClick: MouseEventHandler<HTMLButtonElement> = () => {
    navigate('/to-do-list');
  };

  const handleAddMeetingClick: MouseEventHandler<HTMLButtonElement> = () => {
    setIsAddMeetingOpen(true);
  };

  const handleCloseAddMeetingClick: MouseEventHandler<HTMLButtonElement> = () => {
    setIsAddMeetingOpen(false);
  };

  const handleLogoutClick: MouseEventHandler<HTMLButtonElement> = () => undefined;

  return (
    <main className="meeting-layout-template">
      <Navbar
        activePage={activePage}
        onMeetingListClick={handleMeetingListClick}
        onToDoListClick={handleToDoListClick}
        onAddMeetingClick={handleAddMeetingClick}
        onLogoutClick={handleLogoutClick}
      />

      <section className="meeting-layout-content">{children}</section>

      <AddMeetingPopup isOpen={isAddMeetingOpen} onClose={handleCloseAddMeetingClick} />
    </main>
  );
};

export default MeetingLayoutTemplate;
