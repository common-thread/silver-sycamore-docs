"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { usePermissions } from "@/hooks/usePermissions";

const ROLE_COLORS: Record<string, string> = {
  admin: "var(--color-accent)",
  manager: "var(--color-ink-light)",
  staff: "var(--color-ink-muted)",
};

// Auth toggle check - must match ConvexClientProvider
const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH !== "false";

// Wrapper component that only uses Clerk hooks when auth is enabled
function AuthenticatedUserMenu() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const { role, isLoading: permissionsLoading, user } = usePermissions();

  const isLoading = !isLoaded || permissionsLoading;

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

  if (!isSignedIn) {
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
      {/* Role Badge */}
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.6875rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: ROLE_COLORS[role] || "var(--color-ink-muted)",
          padding: "0.25rem 0.5rem",
          border: `1px solid ${ROLE_COLORS[role] || "var(--color-border)"}`,
          borderRadius: "2px",
        }}
      >
        {role}
      </span>

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

export function UserMenu() {
  // When auth is disabled, show simple guest indicator
  if (!isAuthEnabled) {
    return (
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          color: "var(--color-ink-muted)",
        }}
      >
        Guest Mode
      </div>
    );
  }

  return <AuthenticatedUserMenu />;
}
