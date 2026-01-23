"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { LogoIcon } from "@/components/Logo";

/**
 * Next.js App Router error page.
 * This catches errors at the route level and displays a branded error UI.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Route error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-8)",
        backgroundColor: "var(--color-paper)",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            marginBottom: "var(--space-8)",
            opacity: 0.6,
          }}
        >
          <LogoIcon size="lg" />
        </div>

        {/* Error Icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto var(--space-6)",
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
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            fontWeight: "var(--font-bold)",
            color: "var(--color-ink)",
            marginBottom: "var(--space-3)",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          Something went wrong
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: "var(--color-ink-muted)",
            marginBottom: "var(--space-8)",
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          We apologize for the inconvenience. An unexpected error occurred while loading this page.
        </p>

        {/* Error digest for support reference */}
        {error.digest && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-ink-subtle)",
              marginBottom: "var(--space-6)",
              padding: "var(--space-2) var(--space-4)",
              backgroundColor: "var(--color-paper-warm)",
              borderRadius: "var(--radius-sm)",
              display: "inline-block",
            }}
          >
            Reference: {error.digest}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button variant="primary" onClick={() => reset()}>
            Try Again
          </Button>
          <Button variant="secondary" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
