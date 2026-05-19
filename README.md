# Buildrix

A responsive, full-stack task management web application built with React 19, Vite, Tailwind CSS v4, Supabase, and TanStack Query. Supports authenticated CRUD, real-time sync, dark mode, search, filtering, and pagination.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 19 (functional components + hooks) |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| Backend & Database | Supabase (PostgreSQL + Auth + Realtime) |
| Server State | TanStack Query v5 |
| Build Tool | Vite |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- A free [Supabase](https://supabase.com) project

### Installation

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in your Supabase project values:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase database setup

Run the following SQL in your Supabase SQL Editor:

```sql
create table tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text default '',
  status text default 'Pending' check (status in ('Pending', 'Completed')),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id)
);

alter table tasks enable row level security;

create policy "Users manage own tasks" on tasks
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table public.tasks;
```

### Running the app

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── components/
│   ├── CreateTaskForm.jsx   # Modal form for creating a new task
│   ├── EditTaskModal.jsx    # Modal form for editing an existing task
│   ├── ErrorBoundary.jsx    # Catches uncaught render errors
│   ├── Navbar.jsx           # Top navigation bar with dark mode toggle and user info
│   ├── TaskCard.jsx         # Individual task card with full CRUD actions
│   ├── TaskForm.jsx         # Shared controlled form used by create and edit
│   ├── TaskSkeleton.jsx     # Animated loading placeholder card
│   └── Toast.jsx            # Lightweight toast notification
├── context/
│   ├── AuthContext.jsx      # Supabase session state and sign out
│   └── TaskContext.jsx      # Task state and all CRUD handlers
├── hooks/
│   └── useTasks.js          # TanStack Query fetch, mutations, and Realtime subscription
├── lib/
│   └── supabaseClient.js    # Supabase client initialisation
├── pages/
│   ├── auth/
│   │   ├── SignIn.jsx       # Email/password sign in
│   │   └── SignUp.jsx       # Account registration
│   └── TaskDashboard.jsx    # Main dashboard with grid, search, filter, pagination
├── services/
│   └── taskService.js       # All Supabase API calls and first-login seed function
├── utils/
│   └── storage.js           # Safe localStorage wrapper (Safari private mode safe)
├── App.jsx                  # Root component, routing, auth protection, QueryClientProvider
├── index.css                # Tailwind import, dark mode variant, animations
└── main.jsx                 # React DOM entry point
```

---

## Features

### Authentication
- Email and password sign up and sign in via Supabase Auth
- Protected routes — unauthenticated users are redirected to `/signin`
- Signed-in user's email displayed in the navbar with a sign out button

### First-Login Seeding
- On a new user's first login, 100 tasks are automatically imported from the JSONPlaceholder public API and inserted into their Supabase account as real, fully editable rows
- On all subsequent logins, existing tasks are loaded directly — seeding never runs again

### Task Management
- **Create** — form with title, description, and status fields; inline validation on blur and submit (title min 3 chars)
- **Edit** — pre-populated modal; stays open and shows error on API failure without losing edits
- **Delete** — inline confirmation prompt before executing
- **Toggle status** — switches between Pending and Completed with optimistic update and rollback on failure

### Real-Time Sync
- Supabase Realtime subscription keeps the task board in sync across browser tabs and devices instantly
- TanStack Query cache is invalidated on every Realtime event so the UI always reflects the database state

### Dashboard
- Responsive card grid — 1 column on mobile, 2 on tablet, 3 on desktop
- Loading skeleton UI while tasks are being fetched or seeded
- Empty state message when no tasks exist or no results match
- Error state if the fetch fails

### Search & Filter
- Real-time title search — client-side, no API call per keystroke
- Status filter tabs — All, Pending, Completed
- Search and filter work simultaneously

### Pagination
- 9 tasks per page
- Page resets to last valid page when tasks are deleted and the current page becomes empty

### Dark Mode
- Toggle in the navbar
- Preference persisted in `localStorage` under the key `buildrix-theme`
- Restored on page load and applied via Tailwind's `dark:` variant throughout all components
- localStorage access wrapped in try/catch for Safari private mode safety

### Toast Notifications
- Custom lightweight implementation — no external library
- Success and error variants
- Auto-dismisses after 3 seconds
- Animates in via CSS on each new notification

---

## API

All data is stored in Supabase PostgreSQL. The `taskService.js` module wraps all database calls.

| Operation | Function | Description |
|-----------|----------|-------------|
| Fetch all | `getTasks()` | Returns all tasks for the authenticated user, ordered by `created_at` descending |
| Create | `createTask(task)` | Inserts a new task row with the user's `user_id` |
| Update | `updateTask(id, updates)` | Updates a task by UUID |
| Delete | `deleteTask(id)` | Deletes a task by UUID |
| Seed | `seedTasksFromPublicAPI(userId)` | Imports 100 tasks from JSONPlaceholder — runs once per new user |

Task shape (Supabase row):

```json
{
  "id": "uuid",
  "title": "Example task",
  "description": "A short description.",
  "status": "Pending",
  "created_at": "2025-01-01T00:00:00.000Z",
  "user_id": "uuid"
}
```

---

## Architecture Notes

- All Supabase calls are isolated in `services/taskService.js` — no direct database calls inside components
- Server state is managed by TanStack Query — `useQuery` for fetching, `useMutation` for writes
- The `['tasks', user.id]` query key scopes the cache per user so switching accounts never shows stale data
- Supabase Realtime subscription is set up in `useTasks.js` and invalidates the TanStack Query cache on every INSERT, UPDATE, and DELETE event
- `AuthContext` owns the Supabase session and exposes `user` and `signOut`
- `TaskContext` consumes `AuthContext` and passes `user` to `useTasks` — no prop drilling
- Dark mode is the only data stored in `localStorage` — all task data lives in Supabase

---

## Deployment

The app is deployed on Vercel. Set the following environment variables in the Vercel dashboard under **Settings → Environment Variables** for Production, Preview, and Development:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon public key |

The `vercel.json` at the project root contains the SPA rewrite rule required for client-side routing:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
