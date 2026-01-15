"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";

export function SuggestionList() {
  const { user } = usePermissions();

  // Get current user's suggestions
  const suggestions = useQuery(
    api.suggestions.listByAuthor,
    user?.id ? { authorId: user.id as Id<"users"> } : "skip"
  );

  if (suggestions === undefined) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-muted)",
        }}
      >
        Loading suggestions...
      </div>
    );
  }

  // Group by status
  const drafts = suggestions.filter((s) => s.status === "draft");
  const pending = suggestions.filter((s) => s.status === "pending");
  const approved = suggestions.filter((s) => s.status === "approved");
  const rejected = suggestions.filter((s) => s.status === "rejected");

  const hasAny = suggestions.length > 0;

  if (!hasAny) {
    return (
      <EmptyState
        title="No suggestions yet"
        description="Browse the wiki and click 'Suggest Edit' on any document to propose changes."
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Drafts */}
      {drafts.length > 0 && (
        <SuggestionGroup title="Drafts" suggestions={drafts} />
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <SuggestionGroup title="Pending Review" suggestions={pending} />
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <SuggestionGroup title="Approved" suggestions={approved} />
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <SuggestionGroup title="Rejected" suggestions={rejected} />
      )}
    </div>
  );
}

// Suggestion group section
interface SuggestionGroupProps {
  title: string;
  suggestions: Array<{
    _id: Id<"suggestions">;
    documentId: Id<"documents">;
    status: string;
    title: string;
    changeNote: string;
    documentTitle: string;
    documentSlug: string | null;
    createdAt: number;
    updatedAt: number;
  }>;
}

function SuggestionGroup({ title, suggestions }: SuggestionGroupProps) {
  return (
    <div>
      <h3
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          fontWeight: 500,
          color: "var(--color-ink-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "0.75rem",
        }}
      >
        {title} ({suggestions.length})
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {suggestions.map((suggestion) => (
          <SuggestionItem key={suggestion._id} suggestion={suggestion} />
        ))}
      </div>
    </div>
  );
}

// Individual suggestion item
interface SuggestionItemProps {
  suggestion: {
    _id: Id<"suggestions">;
    documentId: Id<"documents">;
    status: string;
    title: string;
    changeNote: string;
    documentTitle: string;
    documentSlug: string | null;
    createdAt: number;
    updatedAt: number;
  };
}

function SuggestionItem({ suggestion }: SuggestionItemProps) {
  const isDraft = suggestion.status === "draft";
  const href = isDraft
    ? `/suggestions/${suggestion._id}`
    : `/suggestions/${suggestion._id}`;

  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "1rem",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "4px",
        textDecoration: "none",
        transition: "border-color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "0.5rem",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Suggestion title */}
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              marginBottom: "0.25rem",
            }}
          >
            {suggestion.title}
          </div>
          {/* Document reference */}
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--color-ink-muted)",
            }}
          >
            For: {suggestion.documentTitle}
          </div>
        </div>
        <StatusBadge status={suggestion.status} />
      </div>

      {/* Change note */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-light)",
          marginBottom: "0.5rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {suggestion.changeNote}
      </div>

      {/* Timestamps */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.6875rem",
          color: "var(--color-ink-muted)",
        }}
      >
        Created {formatDate(suggestion.createdAt)}
        {suggestion.updatedAt !== suggestion.createdAt && (
          <> &bull; Updated {formatDate(suggestion.updatedAt)}</>
        )}
      </div>
    </Link>
  );
}

// Status badge
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    draft: { bg: "var(--color-surface-dim)", color: "var(--color-ink-muted)" },
    pending: { bg: "#fef3c7", color: "#92400e" },
    approved: { bg: "#dcfce7", color: "#166534" },
    rejected: { bg: "#fee2e2", color: "#991b1b" },
  };

  const style = styles[status] || styles.draft;

  return (
    <span
      style={{
        padding: "0.25rem 0.625rem",
        fontFamily: "var(--font-body)",
        fontSize: "0.6875rem",
        fontWeight: 500,
        textTransform: "capitalize",
        background: style.bg,
        color: style.color,
        borderRadius: "2px",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

// Empty state
function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        padding: "3rem 2rem",
        textAlign: "center",
        background: "var(--color-surface-dim)",
        borderRadius: "4px",
        border: "1px solid var(--color-border)",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "var(--color-ink)",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-muted)",
          margin: 0,
          maxWidth: "40ch",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {description}
      </p>
    </div>
  );
}

// Date formatter
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return "today";
  } else if (days === 1) {
    return "yesterday";
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}
