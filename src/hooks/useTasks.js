import { useState, useCallback } from 'react';
import { getTasks } from '../services/taskService';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getTasks(signal);
      setTasks(data);
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        setError('Failed to load tasks. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { tasks, setTasks, loading, error, fetchTasks };
}
