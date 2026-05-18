import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false };
  }

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  componentDidCatch(err, info) {
    console.error('[Buildrix] Uncaught render error:', err, info.componentStack);
  }

  render() {
    if (this.state.crashed) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center bg-gray-50 dark:bg-gray-900">
          <span className="text-6xl">💥</span>
          <p className="text-gray-800 dark:text-white font-semibold text-lg">Something went wrong</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">The page encountered an unexpected error.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
