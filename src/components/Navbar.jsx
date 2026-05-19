import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import storage from '../utils/storage';

export default function Navbar({ onCreateClick }) {
  const { user, signOut } = useAuth();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    storage.set('buildrix-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <span className="font-bold text-lg text-blue-600 dark:text-blue-400 tracking-tight">Buildrix</span>
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
              {user.email}
            </span>
          )}
          <button
            onClick={() => setDark((d) => !d)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>
          {user && (
            <>
              <button
                onClick={onCreateClick}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition"
              >
                + New Task
              </button>
              <button
                onClick={signOut}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
