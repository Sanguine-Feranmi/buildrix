import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask, seedTasksFromPublicAPI } from '../services/taskService';

export default function useTasks(user) {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading: loading, error } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      const existing = await getTasks();
      if (existing.length === 0 && user?.id) {
        await seedTasksFromPublicAPI(user.id);
        return getTasks();
      }
      return existing;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 30,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });

  const addMutation = useMutation({
    mutationFn: createTask,
    onSuccess: invalidate,
  });

  const editMutation = useMutation({
    mutationFn: ({ id, updates }) => updateTask(id, updates),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: invalidate,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }) => updateTask(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', user?.id] });
      const previous = queryClient.getQueryData(['tasks', user?.id]);
      queryClient.setQueryData(['tasks', user?.id], (old = []) =>
        old.map((t) => (t.id === id ? { ...t, status } : t))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['tasks', user?.id], context.previous);
    },
  });

  return {
    tasks,
    loading,
    error: error?.message ?? null,
    addMutation,
    editMutation,
    removeMutation,
    toggleMutation,
  };
}
