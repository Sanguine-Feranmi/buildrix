const BASE_URL = 'https://dummyjson.com';

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    signal: options.signal ?? controller.signal,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  }).finally(() => clearTimeout(timeout));

  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export const getTasks = (signal) =>
  request('/todos?limit=30', { signal });

export const createTask = (task) =>
  request('/todos/add', {
    method: 'POST',
    body: JSON.stringify({ todo: task.title, completed: false, userId: 1 }),
  });

// Always use id 1 in the URL — local UUIDs are not valid DummyJSON ids.
// Local state is the source of truth; this call is a formality.
export const updateTask = (_id, task) =>
  request('/todos/1', {
    method: 'PUT',
    body: JSON.stringify({ completed: task.completed }),
  });

export const deleteTask = (_id) =>
  request('/todos/1', { method: 'DELETE' });
