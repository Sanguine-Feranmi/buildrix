import { useTaskContext } from '../context/TaskContext';
import TaskForm from './TaskForm';

export default function EditTaskModal({ task, onClose }) {
  const { editTask } = useTaskContext();

  const handleSubmit = async (form) => {
    await editTask(task.id, { ...task, ...form });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-lg animate-fade-in">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Edit Task</h2>
        <TaskForm
          initial={{ title: task.title, description: task.description, status: task.status }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
