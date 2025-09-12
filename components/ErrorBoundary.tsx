'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-error">Something went wrong!</h2>
              <p className="text-base-content/70">
                An unexpected error occurred. Please refresh the page and try again.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-base-200 p-4 rounded-lg mt-4">
                  <h3 className="font-medium text-sm mb-2">Error Details:</h3>
                  <pre className="text-xs overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </div>
              )}
              <div className="card-actions justify-end">
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
