import { createContext, useContext, useRef, useState } from 'react';
import useTasks from '../hooks/useTasks';
import { createTask, updateTask, deleteTask } from '../services/taskService';
import { normalizeTask } from '../utils/normalizeTask';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { tasks, setTasks } = useTasks();
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const addTask = async (taskData) => {
    const raw = await createTask(taskData);
    // Merge form data over the API response so the user's chosen status and
    // description are preserved — DummyJSON always returns completed: false.
    // Replace the API's duplicate id: 256 with a guaranteed-unique local UUID.
    const merged = {
      ...raw,
      id: crypto.randomUUID(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status,
      completed: taskData.status === 'Completed',
      createdAt: new Date().toISOString(),
    };
    const normalized = normalizeTask(merged);
    setTasks((prev) => [normalized, ...prev]);
    showToast('Task created successfully!');
    return normalized;
  };

  const editTask = async (id, taskData) => {
    await updateTask(id, taskData);
    // Build the updated task from local data — don't trust the DummyJSON
    // PUT response since it won't know about our UUID or description.
    const normalized = normalizeTask({
      id,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status,
      completed: taskData.status === 'Completed',
      createdAt: taskData.createdAt,
    });
    setTasks((prev) => prev.map((t) => (t.id === id ? normalized : t)));
    showToast('Task updated successfully!');
    return normalized;
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task deleted successfully!');
  };

  const toggleStatus = async (task) => {
    const flipped = {
      ...task,
      status: task.status === 'Pending' ? 'Completed' : 'Pending',
      completed: !task.completed,
    };
    setTasks((prev) => prev.map((t) => (t.id === task.id ? flipped : t)));
    try {
      await updateTask(task.id, flipped);
    } catch (err) {
      console.error('[Buildrix] toggleStatus failed:', err);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      showToast('Failed to update status.', 'error');
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, editTask, removeTask, toggleStatus, toast }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => useContext(TaskContext);
