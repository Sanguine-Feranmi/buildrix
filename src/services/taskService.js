import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';

if (!baseURL) {
  console.warn('[Buildrix] VITE_API_BASE_URL is not defined. API calls will fail.');
}

const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url ?? '';
    if (status) {
      console.error(`[Buildrix] API error ${status} on ${url}`, err.response?.data ?? '');
    } else if (err.code === 'ECONNABORTED') {
      console.error('[Buildrix] Request timed out:', url);
    } else {
      console.error('[Buildrix] Network error:', err.message);
    }
    return Promise.reject(err);
  }
);

export const getTasks = (signal) => api.get('/', { signal });
export const createTask = (task) => api.post('/', task);
export const updateTask = (id, data) => api.put(`/${id}`, data);
export const deleteTask = (id) => api.delete(`/${id}`);
