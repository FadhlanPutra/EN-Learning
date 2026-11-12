import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.',
    };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('ErrorBoundary menangkap error:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4" aria-hidden="true">😕</div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Terjadi Kesalahan
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Maaf, halaman ini gagal dimuat. Coba muat ulang halaman.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 break-words">
              {this.state.message}
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}