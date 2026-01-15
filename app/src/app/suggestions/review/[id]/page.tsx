"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { SuggestionReview } from "@/components/SuggestionReview";
import Link from "next/link";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function SuggestionReviewDetailPage() {
  const { id } = useParams();
  const { isManager, isLoading: permissionsLoading } = usePermissions();
  const suggestion = useQuery(api.suggestions.getById, {
    id: id as Id<"suggestions">,
  });

  // Permission check - redirect if not manager/admin
  if (!permissionsLoading && !isManager) {
    return (
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--color-ink)",
            marginBottom: "0.5rem",
          }}
        >
          Access Denied
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
            marginBottom: "1rem",
          }}
        >
          Only managers and admins can review suggestions.
        </p>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-accent)",
            textDecoration: "none",
          }}
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  // Loading state
  if (suggestion === undefined || permissionsLoading) {
    return (
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
          }}
        >
          Loading...
        </p>
      </div>
    );
  }

  // Not found
  if (suggestion === null) {
    return (
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--color-ink)",
            marginBottom: "0.5rem",
          }}
        >
          Suggestion Not Found
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
            marginBottom: "1rem",
          }}
        >
          This suggestion may have been deleted.
        </p>
        <Link
          href="/suggestions/review"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-accent)",
            textDecoration: "none",
          }}
        >
          Back to Review List
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        padding: "1.5rem",
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
        }}
      >
        <Link
          href="/suggestions/review"
          style={{
            color: "var(--color-ink-muted)",
            textDecoration: "none",
          }}
        >
          Review
        </Link>
        <span style={{ color: "var(--color-ink-muted)" }}>›</span>
        <span style={{ color: "var(--color-ink-light)" }}>
          {suggestion.documentTitle}
        </span>
      </div>

      {/* Back link */}
      <Link
        href="/suggestions/review"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          color: "var(--color-ink-muted)",
          textDecoration: "none",
          marginBottom: "1rem",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 4L6 8L10 12"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to Review List
      </Link>

      {/* Title */}
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "var(--color-ink)",
          marginBottom: "1.5rem",
        }}
      >
        Review Suggestion
      </h1>

      {/* Suggestion review component */}
      <SuggestionReview suggestionId={id as Id<"suggestions">} />
    </div>
  );
}
