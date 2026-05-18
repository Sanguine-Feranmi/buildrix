# Buildrix

A responsive task management web application built with React 19, Vite, and Tailwind CSS v4. Supports full CRUD, real-time search and filtering, dark mode, optimistic updates, and toast notifications.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 19 (functional components + hooks) |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| Mock Backend | JSON Server |
| Build Tool | Vite |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
npm install
```

### Running the app

You need two terminals running simultaneously.

```bash
# Terminal 1 — start the JSON Server mock API on port 3001
npm run server

# Terminal 2 — start the Vite dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run server` | Start JSON Server on port 3001 |
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
│   ├── Navbar.jsx           # Top navigation bar with dark mode toggle
│   ├── TaskCard.jsx         # Individual task card with actions
│   ├── TaskForm.jsx         # Shared controlled form used by create and edit
│   ├── TaskSkeleton.jsx     # Animated loading placeholder card
│   └── Toast.jsx            # Lightweight toast notification
├── context/
│   └── TaskContext.jsx      # Global state and all CRUD handlers
├── hooks/
│   └── useTasks.js          # Fetch logic with loading and error state
├── pages/
│   └── TaskDashboard.jsx    # Main dashboard with grid, search, filter, pagination
├── services/
│   └── taskService.js       # All axios API calls (GET, POST, PUT, DELETE)
├── App.jsx                  # Root component, routing, modal overlay, toast
├── index.css                # Tailwind import, dark mode variant, animations
└── main.jsx                 # React DOM entry point
```

---

## Features

### Task Management
- **Create** — form with title, description, and status fields; inline validation on blur and submit
- **Edit** — pre-populated modal; stays open and shows error on API failure without losing edits
- **Delete** — inline confirmation prompt before executing; optimistic removal with rollback on failure
- **Toggle status** — switches between Pending and Completed instantly; optimistic update with rollback

### Dashboard
- Responsive card grid — 1 column on mobile, 2 on tablet, 3 on desktop
- Loading skeleton UI while tasks are being fetched
- Empty state message when no tasks exist or no results match
- Error state with a retry button if the fetch fails

### Search & Filter
- Real-time title search — client-side, no API call per keystroke
- Status filter tabs — All, Pending, Completed
- Search and filter work simultaneously

### Pagination
- 9 tasks per page
- Page resets to last valid page when tasks are deleted and the current page becomes empty

### Dark Mode
- Toggle in the navbar
- Preference persisted in `localStorage` and restored on page load
- Applied via Tailwind's `dark:` variant throughout all components

### Toast Notifications
- Custom lightweight implementation — no external library
- Success and error variants
- Auto-dismisses after 3 seconds
- Animates in via CSS on each new notification

---

## API

JSON Server exposes a REST API at `http://localhost:3001/tasks`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Fetch all tasks |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Replace a task by ID |
| DELETE | `/tasks/:id` | Delete a task by ID |

Task shape:

```json
{
  "id": "1",
  "title": "Example task",
  "description": "A short description of the task.",
  "status": "Pending",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## Architecture Notes

- All API calls are isolated in `services/taskService.js` — no raw axios calls inside components
- Global state lives in `TaskContext` and is consumed via the `useTaskContext` hook
- Fetch logic, loading state, and error state are encapsulated in `useTasks.js`
- Optimistic updates are applied immediately on delete and status toggle, with full rollback if the request fails
- Fetch requests are cancelled via `AbortController` when the provider unmounts to prevent state updates on unmounted components
