import React, { Component } from 'react';
import { cc, cn, colors } from '@/styles/shared';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log fout naar een externe service (bijv. Sentry)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div
          className={cn(cc.container.base, cc.spacing.section, 'text-center')}
          role="alert"
        >
          <h2 className={cn(cc.text.h3, 'text-gray-900 mb-4')}>
            Er is iets misgegaan
          </h2>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <p className={cn(cc.text.body, cc.text.muted, 'mb-4')}>
              Foutmelding: {this.state.error.message}
            </p>
          )}
          <p className={cn(cc.text.body, cc.text.muted, 'mb-8')}>
            Probeer opnieuw of ververs de pagina.
          </p>
          <button
            onClick={this.resetError}
            className={cn(
              cc.button.primary,
              colors.primary.focusRing,
              'rounded-full mr-4'
            )}
          >
            Opnieuw proberen
          </button>
          <button
            onClick={() => window.location.reload()}
            className={cn(
              cc.button.secondary,
              colors.secondary.focusRing,
              'rounded-full'
            )}
          >
            Pagina verversen
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}