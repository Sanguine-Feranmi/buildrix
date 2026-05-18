export function normalizeTask(raw) {
  const isCompleted =
    typeof raw.completed === 'boolean'
      ? raw.completed
      : raw.status === 'Completed';

  return {
    id: raw.id,
    title: raw.title || raw.todo || '',
    description: raw.description || '',
    status: isCompleted ? 'Completed' : 'Pending',
    completed: isCompleted,
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

export function normalizeTasks(rawArray) {
  return rawArray.map(normalizeTask);
}
