import { FC, MouseEventHandler } from 'react';
import Navbar from '@organisms/Navbar/Navbar';
import '@pages/MeetingListPage/MeetingListPage.css';

const noopClick: MouseEventHandler<HTMLButtonElement> = () => undefined;

const MeetingListPage: FC = () => {
  return (
    <main className="meeting-list-page">
      <Navbar
        onMeetingListClick={noopClick}
        onToDoListClick={noopClick}
        onAddMeetingClick={noopClick}
        onLogoutClick={noopClick}
      />
    </main>
  );
};

export default MeetingListPage;
