import { useState, useCallback } from 'react';
import { getTasks } from '../services/taskService';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (signal) => {
    if (!import.meta.env.VITE_API_BASE_URL) {
      setError('API URL is not configured. Set VITE_API_BASE_URL in your Vercel environment variables.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data } = await getTasks(signal);
      setTasks(data);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Check your connection and try again.');
      } else {
        setError('Failed to load tasks. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { tasks, setTasks, loading, error, fetchTasks };
}
