"use client";

import { Component, ReactNode } from "react";
import Button from "./ui/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches React rendering errors.
 * Displays a branded error UI with recovery options.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With custom fallback
 * <ErrorBoundary fallback={<CustomError />}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging (could be sent to error tracking service)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Return custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default branded error UI
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            padding: "var(--space-8)",
            textAlign: "center",
            backgroundColor: "var(--color-paper-warm)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Error Icon */}
          <div
            style={{
              width: "48px",
              height: "48px",
              marginBottom: "var(--space-4)",
              color: "var(--color-error)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-xl)",
              fontWeight: "var(--font-semibold)",
              color: "var(--color-ink)",
              marginBottom: "var(--space-2)",
            }}
          >
            Something went wrong
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--color-ink-muted)",
              marginBottom: "var(--space-6)",
              maxWidth: "400px",
            }}
          >
            We encountered an unexpected error. This has been logged and we&apos;ll look into it.
          </p>

          {/* Error details (development only) */}
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details
              style={{
                width: "100%",
                maxWidth: "500px",
                marginBottom: "var(--space-6)",
                padding: "var(--space-3)",
                backgroundColor: "var(--color-error-light)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-xs)",
                fontFamily: "var(--font-mono)",
                color: "var(--color-error-dark)",
                textAlign: "left",
              }}
            >
              <summary style={{ cursor: "pointer", fontWeight: "var(--font-medium)" }}>
                Error Details
              </summary>
              <pre
                style={{
                  marginTop: "var(--space-2)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <Button variant="secondary" onClick={this.handleRetry}>
              Try Again
            </Button>
            <Button variant="primary" onClick={this.handleRefresh}>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
