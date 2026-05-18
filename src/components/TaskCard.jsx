import { useState, useRef, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import EditTaskModal from './EditTaskModal';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

export default function TaskCard({ task }) {
  const { removeTask, toggleStatus } = useTaskContext();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const desc = task.description ?? '';
  const isTruncated = desc.length > 100;
  const displayDesc = expanded || !isTruncated ? desc : desc.slice(0, 100) + '…';

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await removeTask(task.id);
    } catch {
      if (mounted.current) {
        setDeleting(false);
        setConfirmDelete(false);
      }
    }
  };

  const statusCls =
    task.status === 'Completed'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800 dark:text-white text-base leading-snug line-clamp-2">
            {task.title}
          </h3>
          <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full transition-colors duration-300 ${statusCls}`}>
            {task.status}
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {displayDesc}
          {isTruncated && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="ml-1 text-blue-500 hover:underline text-xs font-medium"
            >
              {expanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </p>

        <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(task.createdAt)}</p>

        <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => toggleStatus(task)}
            className="flex-1 text-xs font-medium py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Mark {task.status === 'Pending' ? 'Completed' : 'Pending'}
          </button>
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
          >
            Edit
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition"
          >
            Delete
          </button>
        </div>

        {confirmDelete && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-sm text-red-700 dark:text-red-300 flex flex-col gap-2">
            <p className="font-medium">Delete this task?</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-1.5 rounded-lg transition disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-xs font-medium py-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {editing && <EditTaskModal task={task} onClose={() => setEditing(false)} />}
    </>
  );
}
