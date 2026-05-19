import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import TaskDashboard from './pages/TaskDashboard';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Navbar from './components/Navbar';
import CreateTaskForm from './components/CreateTaskForm';
import Toast from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import storage from './utils/storage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? children : <Navigate to="/signin" replace />;
}

function AppShell() {
  const { toast } = useTaskContext();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar onCreateClick={() => setShowCreate(true)} />

      <Routes>
        <Route path="/" element={<TaskDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showCreate && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={(e) => e.target === e.currentTarget && setShowCreate(false)}
        >
          <div className="w-full max-w-lg animate-fade-in">
            <CreateTaskForm onClose={() => setShowCreate(false)} />
          </div>
        </div>
      )}

      {toast && <Toast key={toast.message + toast.type} message={toast.message} type={toast.type} />}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    if (storage.get('buildrix-theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <TaskProvider>
                      <AppShell />
                    </TaskProvider>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
