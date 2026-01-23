"use client";

import { Suggestion, formatDate } from "./types";

interface SuggestionHeaderProps {
  suggestion: Suggestion;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: "rgba(100, 100, 100, 0.1)", text: "#666" },
  pending: { bg: "rgba(234, 179, 8, 0.1)", text: "#b45309" },
  approved: { bg: "rgba(21, 128, 61, 0.1)", text: "#15803d" },
  rejected: { bg: "rgba(185, 28, 28, 0.1)", text: "#b91c1c" },
};

export function SuggestionHeader({ suggestion }: SuggestionHeaderProps) {
  const colors = statusColors[suggestion.status] || statusColors.draft;

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        padding: "1rem",
        background: "var(--color-surface-dim)",
        border: "1px solid var(--color-border)",
        borderRadius: "4px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
        <span
          style={{
            display: "inline-block",
            padding: "0.25rem 0.75rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            background: colors.bg,
            color: colors.text,
            borderRadius: "2px",
          }}
        >
          {suggestion.status}
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "var(--color-ink-muted)",
          }}
        >
          Submitted {formatDate(suggestion.createdAt)}
        </span>
      </div>

      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink)",
          marginBottom: "0.5rem",
        }}
      >
        <strong>Author:</strong> {suggestion.authorDisplayName}
      </div>

      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink)",
        }}
      >
        <strong>Change Note:</strong> {suggestion.changeNote}
      </div>

      {suggestion.reviewerDisplayName && (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink)",
            marginTop: "0.5rem",
          }}
        >
          <strong>Reviewed by:</strong> {suggestion.reviewerDisplayName}
          {suggestion.reviewNote && (
            <span style={{ fontStyle: "italic", marginLeft: "0.5rem" }}>
              &ldquo;{suggestion.reviewNote}&rdquo;
            </span>
          )}
        </div>
      )}
    </div>
  );
}
