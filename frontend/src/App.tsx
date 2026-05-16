import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MeetingListPage from '@pages/MeetingListPage/MeetingListPage';
import ToDoListPage from '@pages/ToDoListPage/ToDoListPage';
import MeetingDetailsPage from '@pages/MeetingDetailsPage/MeetingDetailsPage';
import AdminDashboardPage from '@pages/AdminDashboardPage/AdminDashboardPage';
import AuthPage from '@pages/AuthPage/AuthPage';

const USER_ID_STORAGE_KEY = 'userId';

function App() {
  const [isAuthed, setIsAuthed] = useState(() =>
    Boolean(localStorage.getItem(USER_ID_STORAGE_KEY)),
  );
  const requireAuth = (element: ReactElement) =>
    isAuthed ? element : <Navigate to="/auth" replace />;

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthed(Boolean(localStorage.getItem(USER_ID_STORAGE_KEY)));
    };

    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth:changed', syncAuth as EventListener);

    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth:changed', syncAuth as EventListener);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthed ? '/meeting-list' : '/auth'} replace />}
        />
        <Route
          path="/auth"
          element={isAuthed ? <Navigate to="/meeting-list" replace /> : <AuthPage />}
        />
        <Route path="/meeting-list" element={requireAuth(<MeetingListPage />)} />
        <Route path="/meeting/:meetingId" element={requireAuth(<MeetingDetailsPage />)} />
        <Route path="/to-do-list" element={requireAuth(<ToDoListPage />)} />
        <Route path="/admin-dashboard" element={requireAuth(<AdminDashboardPage />)} />
        <Route
          path="*"
          element={<Navigate to={isAuthed ? '/meeting-list' : '/auth'} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
