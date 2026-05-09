import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MeetingListPage from '@pages/MeetingListPage/MeetingListPage';
import ToDoListPage from '@pages/ToDoListPage/ToDoListPage';
import MeetingDetailsPage from '@pages/MeetingDetailsPage/MeetingDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/meeting-list" replace />} />
        <Route path="/meeting-list" element={<MeetingListPage />} />
        <Route path="/meeting/:meetingId" element={<MeetingDetailsPage />} />
        <Route path="/to-do-list" element={<ToDoListPage />} />
        <Route path="*" element={<Navigate to="/meeting-list" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
