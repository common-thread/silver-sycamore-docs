"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function UserMenu() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return (
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          color: "var(--color-ink-muted)",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <button
        onClick={() => signOut()}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          fontWeight: 500,
          color: "var(--color-ink-light)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "0.5rem 0.75rem",
          transition: "color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--color-accent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--color-ink-light)";
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
