"use client";

interface VersionBadgeProps {
  version: number | undefined;
  onClick?: () => void;
}

export function VersionBadge({ version, onClick }: VersionBadgeProps) {
  const displayVersion = version ?? 0;

  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.25rem 0.5rem",
        fontFamily: "var(--font-body)",
        fontSize: "0.6875rem",
        fontWeight: 600,
        color: "var(--color-ink-muted)",
        background: "var(--color-background)",
        border: "1px solid var(--color-border)",
        borderRadius: "2px",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.15s ease, color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = "var(--color-accent)";
          e.currentTarget.style.color = "var(--color-accent)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.color = "var(--color-ink-muted)";
      }}
    >
      {/* History icon */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      v{displayVersion}
    </button>
  );
}
