import { createContext, useContext, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import useTasks from '../hooks/useTasks';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const { tasks, loading, error, addMutation, editMutation, removeMutation, toggleMutation } = useTasks(user);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const addTask = async (taskData) => {
    await addMutation.mutateAsync(taskData);
    showToast('Task created successfully!');
  };

  const editTask = async (id, taskData) => {
    await editMutation.mutateAsync({
      id,
      updates: { title: taskData.title, description: taskData.description || '', status: taskData.status },
    });
    showToast('Task updated successfully!');
  };

  const removeTask = async (id) => {
    await removeMutation.mutateAsync(id);
    showToast('Task deleted successfully!');
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      await toggleMutation.mutateAsync({ id: task.id, status: newStatus });
      showToast('Status updated successfully!');
    } catch (err) {
      console.error('[Buildrix] toggleStatus failed:', err);
      showToast('Failed to update status.', 'error');
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, error, addTask, editTask, removeTask, toggleStatus, toast }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => useContext(TaskContext);
