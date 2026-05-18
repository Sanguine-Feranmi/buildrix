import { createContext, useContext, useEffect, useRef, useState } from 'react';
import useTasks from '../hooks/useTasks';
import { createTask, updateTask, deleteTask } from '../services/taskService';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { tasks, setTasks, loading, error, fetchTasks } = useTasks();
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchTasks(controller.signal);
    return () => controller.abort();
  }, [fetchTasks]);

  const showToast = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const addTask = async (taskData) => {
    const { data } = await createTask({ ...taskData, createdAt: new Date().toISOString() });
    setTasks((prev) => [data, ...prev]);
    showToast('Task created successfully!');
    return data;
  };

  const editTask = async (id, taskData) => {
    const { data } = await updateTask(id, taskData);
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    showToast('Task updated successfully!');
    return data;
  };

  const removeTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
      showToast('Task deleted successfully!');
    } catch {
      fetchTasks();
      showToast('Failed to delete task.', 'error');
      throw new Error('Delete failed');
    }
  };

  const toggleStatus = async (task) => {
    const updated = { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' };
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    try {
      await updateTask(task.id, updated);
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      showToast('Failed to update status.', 'error');
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, error, fetchTasks, addTask, editTask, removeTask, toggleStatus, toast }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => useContext(TaskContext);
