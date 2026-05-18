export default function TaskSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between gap-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
      <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
        <div className="flex-1 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="w-12 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}
