import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/tasks' });

export const getTasks = (signal) => api.get('/', { signal });
export const createTask = (task) => api.post('/', task);
export const updateTask = (id, data) => api.put(`/${id}`, data);
export const deleteTask = (id) => api.delete(`/${id}`);
