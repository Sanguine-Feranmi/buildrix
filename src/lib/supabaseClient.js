import { createClient } from '@supabase/supabase-js';

// Database schema (run in Supabase SQL Editor):
//
// create table tasks (
//   id uuid default gen_random_uuid() primary key,
//   title text not null,
//   description text default '',
//   status text default 'Pending' check (status in ('Pending', 'Completed')),
//   created_at timestamptz default now(),
//   user_id uuid references auth.users(id)
// );
//
// alter table tasks enable row level security;
//
// create policy "Users manage own tasks" on tasks
//   for all using (auth.uid() = user_id)
//   with check (auth.uid() = user_id);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Buildrix] Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
