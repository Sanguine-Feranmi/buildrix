import { supabase } from '../lib/supabaseClient';

export const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

export const createTask = async (task) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title: task.title, description: task.description || '', status: task.status, user_id: user.id }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateTask = async (id, updates) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteTask = async (id) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
};

export const seedTasksFromPublicAPI = async (userId) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=100');
  if (!response.ok) throw new Error('Failed to fetch seed tasks');
  const raw = await response.json();

  const tasks = raw.map((item) => ({
    title: item.title.charAt(0).toUpperCase() + item.title.slice(1),
    description: 'Task imported from public feed. Edit as needed.',
    status: item.completed ? 'Completed' : 'Pending',
    user_id: userId,
  }));

  const { error } = await supabase.from('tasks').insert(tasks);
  if (error) throw new Error(`Seed failed: ${error.message}`);
};
