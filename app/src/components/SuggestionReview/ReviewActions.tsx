"use client";

import { Suggestion, formatDate } from "./types";

interface ReviewActionsProps {
  suggestion: Suggestion;
  isManager: boolean;
  isSubmitting: boolean;
  onApproveClick: () => void;
  onRejectClick: () => void;
  onPromoteClick: () => void;
}

export function ReviewActions({
  suggestion,
  isManager,
  isSubmitting,
  onApproveClick,
  onRejectClick,
  onPromoteClick,
}: ReviewActionsProps) {
  // Review actions for managers/admins with pending suggestions
  if (isManager && suggestion.status === "pending") {
    return (
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          padding: "1rem",
          background: "var(--color-surface-dim)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
        }}
      >
        <button
          onClick={onApproveClick}
          disabled={isSubmitting}
          style={{
            padding: "0.5rem 1.25rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#fff",
            background: "#15803d",
            border: "none",
            borderRadius: "2px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          Approve
        </button>
        <button
          onClick={onRejectClick}
          disabled={isSubmitting}
          style={{
            padding: "0.5rem 1.25rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#b91c1c",
            background: "transparent",
            border: "1px solid #b91c1c",
            borderRadius: "2px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          Reject
        </button>
      </div>
    );
  }

  // Apply changes button for approved suggestions
  if (isManager && suggestion.status === "approved" && !suggestion.appliedAt) {
    return (
      <div
        style={{
          padding: "1rem",
          background: "rgba(21, 128, 61, 0.05)",
          border: "1px solid rgba(21, 128, 61, 0.2)",
          borderRadius: "4px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink)",
            marginBottom: "0.75rem",
          }}
        >
          This suggestion has been approved. Apply the changes to update the official document.
        </p>
        <button
          onClick={onPromoteClick}
          disabled={isSubmitting}
          style={{
            padding: "0.5rem 1.25rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#fff",
            background: "var(--color-accent)",
            border: "none",
            borderRadius: "2px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          {isSubmitting ? "Applying..." : "Apply Changes"}
        </button>
      </div>
    );
  }

  // Applied indicator
  if (suggestion.appliedAt) {
    return (
      <div
        style={{
          padding: "1rem",
          background: "rgba(21, 128, 61, 0.05)",
          border: "1px solid rgba(21, 128, 61, 0.2)",
          borderRadius: "4px",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "#15803d",
        }}
      >
        Changes applied to document on {formatDate(suggestion.appliedAt)}
      </div>
    );
  }

  return null;
}
