import { useTaskContext } from '../context/TaskContext';
import TaskForm from './TaskForm';

export default function CreateTaskForm({ onClose }) {
  const { addTask } = useTaskContext();

  const handleSubmit = async (form) => {
    await addTask(form);
    onClose();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Create New Task</h2>
      <TaskForm onSubmit={handleSubmit} onCancel={onClose} submitLabel="Create Task" />
    </div>
  );
}
