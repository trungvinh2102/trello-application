import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by Error Boundary:', error, errorInfo);
    console.error('Component stack:', errorInfo.componentStack);

    if (import.meta.env.PROD) {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(console.error);
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.handleReset();
    window.location.href = '/';
  };

  handleRefresh = () => {
    this.handleReset();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error } = this.state;

      return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold">Something went wrong</CardTitle>
              <CardDescription className="text-base">
                {error?.message || 'An unexpected error occurred'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                We apologize for the inconvenience. Please try refreshing the page or go back to the
                homepage.
              </p>

              {import.meta.env.DEV && error?.stack && (
                <details className="w-full">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="rounded-md bg-muted p-3">
                      <p className="font-medium mb-1">Error Message:</p>
                      <code className="break-all text-destructive">{error.message}</code>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="font-medium mb-1">Stack Trace:</p>
                      <pre className="overflow-x-auto text-muted-foreground">{error.stack}</pre>
                    </div>
                  </div>
                </details>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button onClick={this.handleRefresh} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
              <Button variant="outline" onClick={this.handleGoHome} className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
          <CardDescription>The page you're looking for doesn't exist.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            The requested page could not be found.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => (window.location.href = '/')} className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export const ErrorBoundary = ErrorBoundaryClass;
