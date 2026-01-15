"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { SuggestionForm } from "@/components/SuggestionForm";
import { ContentBox } from "@/components/ContentBox";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";

export default function SuggestionDetailPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = usePermissions();
  const router = useRouter();
  const params = useParams();
  const suggestionId = params.id as Id<"suggestions">;

  // Fetch the suggestion
  const suggestion = useQuery(
    api.suggestions.getById,
    suggestionId ? { id: suggestionId } : "skip"
  );

  // Redirect unauthenticated users
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/signin");
    }
  }, [isLoaded, isSignedIn, router]);

  // Check if current user is the author
  const isAuthor =
    user?.id && suggestion?.authorId && user.id === suggestion.authorId;

  // Redirect non-authors (after load complete)
  useEffect(() => {
    if (suggestion !== undefined && suggestion !== null && user !== undefined) {
      if (!isAuthor) {
        router.push("/suggestions");
      }
    }
  }, [suggestion, user, isAuthor, router]);

  // Show loading while checking auth
  if (!isLoaded || !isSignedIn) {
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
          Loading...
        </div>
      </ContentBox>
    );
  }

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

    </>
  );
}
  );
}
