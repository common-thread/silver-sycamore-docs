"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { SuggestionForm } from "@/components/SuggestionForm";
import { ContentBox } from "@/components/ContentBox";
import Link from "next/link";

export default function SuggestionDetailPage() {
  const params = useParams();
  const suggestionId = params.id as Id<"suggestions">;

  // Fetch the suggestion
  const suggestion = useQuery(
    api.suggestions.getById,
    suggestionId ? { id: suggestionId } : "skip"
  );

  // Loading suggestion
  if (suggestion === undefined) {
    return (
      <ContentBox>
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
          }}
        >
          Loading suggestion...
        </div>
      </ContentBox>
    );
  }

  // Suggestion not found
  if (suggestion === null) {
    return (
      <ContentBox>
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              marginBottom: "0.5rem",
            }}
          >
            Suggestion Not Found
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ink-muted)",
              marginBottom: "1rem",
            }}
          >
            This suggestion doesn&apos;t exist or has been deleted.
          </p>
          <Link
            href="/suggestions"
            style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-surface)",
              background: "var(--color-accent)",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            Back to Suggestions
          </Link>
        </div>
      </ContentBox>
    );
  }

  const isDraft = suggestion.status === "draft";

  const handleSubmit = () => {
    // Stay on page but show updated status
  };

  return (
    <>
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          color: "var(--color-ink-muted)",
          marginBottom: "1.5rem",
        }}
      >
        <Link
          href="/suggestions"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Suggestions
        </Link>
        <span>&gt;</span>
        <span style={{ color: "var(--color-ink-light)" }}>
          {suggestion.title}
        </span>
      </div>

      <ContentBox>
        {/* Header */}
        <div
          style={{
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                margin: 0,
              }}
            >
              {isDraft ? "Edit Suggestion" : "View Suggestion"}
            </h1>
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ink-muted)",
              margin: 0,
            }}
          >
            For document: {suggestion.documentTitle}
          </p>
        </div>

        {/* Form (editable if draft, read-only otherwise) */}
        <SuggestionForm suggestionId={suggestionId} onSubmit={handleSubmit} />
      </ContentBox>
    </>
  );
}
