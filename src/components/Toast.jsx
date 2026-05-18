export default function Toast({ message, type = 'success' }) {
  const colors = { success: 'bg-green-600', error: 'bg-red-600' };

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-fade-in ${colors[type]}`}>
      {type === 'success' ? '✓' : '✕'} {message}
    </div>
  );
}
