import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ToastProvider, useToast } from './context/ToastContext';
import { Home, Shop, ItemDetail, History, Leaderboard, Login, Account } from './pages';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <>{children}</>;
}

function SessionExpiryWatcher() {
  const { sessionExpired, clearSessionExpired } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionExpired) {
      showToast('Sesi berakhir, masukkan nama kelompok lagi.', 'warning');
      clearSessionExpired();
      navigate('/login', { replace: true });
    }
  }, [sessionExpired, clearSessionExpired, showToast, navigate]);

  return null;
}

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <SessionExpiryWatcher />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
            <Route path="/item/:id" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;