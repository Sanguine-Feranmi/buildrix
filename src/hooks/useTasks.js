import { useState } from 'react';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  return { tasks, setTasks };
}
