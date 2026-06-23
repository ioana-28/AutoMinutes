import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MeetingListPage from '@pages/MeetingListPage/MeetingListPage';
import ToDoListPage from '@pages/ToDoListPage/ToDoListPage';
import AdminDashboardPage from '@pages/AdminDashboardPage/AdminDashboardPage';
import AuthPage from '@pages/AuthPage/AuthPage';
import { clearStoredAuth, isStoredAuthTokenValid } from '@/utils/auth';

const getAuthState = () => {
  if (!isStoredAuthTokenValid()) {
    clearStoredAuth();
    return false;
  }

  return true;
};

function App() {
  const [isAuthed, setIsAuthed] = useState(getAuthState);
  const requireAuth = (element: ReactElement) =>
    isAuthed ? element : <Navigate to="/auth" replace />;

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthed(getAuthState());
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
        <Route path="/" element={<Navigate to={isAuthed ? '/meeting-list' : '/auth'} replace />} />
        <Route
          path="/auth"
          element={isAuthed ? <Navigate to="/meeting-list" replace /> : <AuthPage />}
        />
        <Route path="/meeting-list" element={requireAuth(<MeetingListPage />)} />
        <Route path="/meeting/:meetingId" element={requireAuth(<MeetingListPage />)} />
        <Route path="/to-do-list" element={requireAuth(<ToDoListPage />)} />
        <Route path="/admin-dashboard" element={requireAuth(<AdminDashboardPage />)} />
        <Route path="*" element={<Navigate to={isAuthed ? '/meeting-list' : '/auth'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
