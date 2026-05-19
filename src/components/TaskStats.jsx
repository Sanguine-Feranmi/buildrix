import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';

function StatCard({ icon: Icon, count, total, label, color }) {
  const width = total > 0 ? Math.min((count / total) * 100, 100) : 0;

  const styles = {
    blue: {
      card: 'bg-blue-50 border-blue-200 dark:bg-gray-800 dark:border-gray-700',
      iconWrap: 'bg-blue-100 dark:bg-gray-700',
      icon: 'text-blue-600',
      bar: 'bg-blue-100 dark:bg-gray-700',
      fill: 'bg-blue-500',
    },
    green: {
      card: 'bg-green-50 border-green-200 dark:bg-gray-800 dark:border-gray-700',
      iconWrap: 'bg-green-100 dark:bg-gray-700',
      icon: 'text-green-600',
      bar: 'bg-green-100 dark:bg-gray-700',
      fill: 'bg-green-500',
    },
    yellow: {
      card: 'bg-yellow-50 border-yellow-200 dark:bg-gray-800 dark:border-gray-700',
      iconWrap: 'bg-yellow-100 dark:bg-gray-700',
      icon: 'text-yellow-600',
      bar: 'bg-yellow-100 dark:bg-gray-700',
      fill: 'bg-yellow-500',
    },
  };

  const s = styles[color];

  return (
    <div className={`flex items-center gap-4 border rounded-2xl px-6 py-4 flex-1 ${s.card}`}>
      <div className={`p-3 rounded-xl shrink-0 ${s.iconWrap}`}>
        <Icon size={22} className={s.icon} />
      </div>
      <div className="flex flex-col min-w-0 w-full">
        <span className="text-2xl font-bold text-gray-800 dark:text-white">{count}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <div className={`w-full h-1.5 rounded-full mt-2 ${s.bar}`}>
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${s.fill}`}
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function TaskStats({ tasks }) {
  const safeTasks = tasks ?? [];
  const total = safeTasks.length;
  const completed = safeTasks.filter((t) => t.status === 'Completed').length;
  const pending = safeTasks.filter((t) => t.status === 'Pending').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-6">
      <StatCard icon={ClipboardList} count={total} total={total} label="Total Tasks" color="blue" />
      <StatCard icon={CheckCircle2} count={completed} total={total} label="Completed" color="green" />
      <StatCard icon={Clock} count={pending} total={total} label="Pending" color="yellow" />
    </div>
  );
}
