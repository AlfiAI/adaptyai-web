
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 p-4 bg-red-500/10 rounded-full">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-4 max-w-md">
            We've encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          <div className="space-x-4">
            <Button 
              onClick={this.handleReset} 
              variant="outline"
              className="border-adapty-aqua text-adapty-aqua hover:bg-adapty-aqua/10"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()} 
              variant="default"
              className="bg-adapty-aqua text-black hover:bg-adapty-aqua/80"
            >
              Refresh Page
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-6 p-4 bg-black/30 rounded text-left overflow-auto max-h-96 w-full">
              <p className="text-red-500 font-mono text-sm">Error: {this.state.error.toString()}</p>
              {this.state.errorInfo && (
                <details className="mt-2">
                  <summary className="text-gray-400 cursor-pointer">Stack trace</summary>
                  <pre className="mt-2 text-xs text-gray-400 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      );
    }

    // When there's no error, render children as normal
    return this.props.children;
  }
}

export default ErrorBoundary;
