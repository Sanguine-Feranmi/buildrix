import { useState, useEffect } from 'react';

const EMPTY = { title: '', description: '', status: 'Pending' };

function validate(data) {
  const errs = {};
  if (!data.title.trim()) {
    errs.title = 'Title is required.';
  } else if (data.title.trim().length < 3) {
    errs.title = 'Title must be at least 3 characters.';
  }
  if (data.description.trim().length > 0 && data.description.trim().length < 10) {
    errs.description = 'Description must be at least 10 characters.';
  }
  return errs;
}

export default function TaskForm({ initial = EMPTY, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    setForm(initial);
    setErrors({});
    setTouched({});
    setApiError('');
  }, [initial]);

  const currentErrors = validate(form);
  const isInvalid = Object.keys(currentErrors).length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate({ ...form, [name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched({ title: true, description: true });
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    setApiError('');
    try {
      await onSubmit(form);
    } catch (err) {
      setApiError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (field) =>
    `w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
      touched[field] && errors[field] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputCls('title')}
          placeholder="Enter task title (min. 3 characters)"
        />
        {touched.title && errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description <span className="text-gray-400 font-normal">(optional, min. 10 chars if provided)</span>
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={3}
          className={inputCls('description')}
          placeholder="Enter task description"
        />
        {touched.description && errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
        <select name="status" value={form.status} onChange={handleChange} className={inputCls('status')}>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {apiError && (
        <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{apiError}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting || (Object.keys(touched).length > 0 && isInvalid)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {submitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
