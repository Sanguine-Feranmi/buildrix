import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import TaskDashboard from './pages/TaskDashboard';
import Navbar from './components/Navbar';
import CreateTaskForm from './components/CreateTaskForm';
import Toast from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import storage from './utils/storage';

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
    if (storage.get('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <TaskProvider>
          <AppShell />
        </TaskProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
