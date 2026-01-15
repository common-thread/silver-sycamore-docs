"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";

export default function SuggestionReviewListPage() {
  const router = useRouter();
  const { isManager, isLoading: permissionsLoading } = usePermissions();
  const pendingSuggestions = useQuery(api.suggestions.listPending);

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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading state
  if (pendingSuggestions === undefined || permissionsLoading) {
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

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        padding: "1.5rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            Pending Suggestions
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--color-ink-muted)",
              marginTop: "0.25rem",
            }}
          >
            Review and approve or reject proposed document changes
          </p>
        </div>

        {pendingSuggestions.length > 0 && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "24px",
              height: "24px",
              padding: "0 0.5rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#b45309",
              background: "rgba(234, 179, 8, 0.1)",
              borderRadius: "12px",
            }}
          >
            {pendingSuggestions.length}
          </span>
        )}
      </div>

      {/* Suggestion list */}
      {pendingSuggestions.length === 0 ? (
        <div
          style={{
            padding: "3rem 2rem",
            textAlign: "center",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            style={{ margin: "0 auto 1rem", opacity: 0.4 }}
          >
            <path
              d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
              stroke="var(--color-ink-muted)"
              strokeWidth="2"
            />
            <path
              d="M17 24L22 29L31 19"
              stroke="var(--color-ink-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--color-ink)",
              marginBottom: "0.5rem",
            }}
          >
            No pending suggestions
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ink-muted)",
            }}
          >
            All document suggestions have been reviewed.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {pendingSuggestions.map((suggestion) => (
            <div
              key={suggestion._id}
              onClick={() => router.push(`/suggestions/review/${suggestion._id}`)}
              style={{
                padding: "1rem",
                background: "var(--color-background)",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "border-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "var(--color-ink)",
                    margin: 0,
                  }}
                >
                  {suggestion.documentTitle}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--color-ink-muted)",
                    whiteSpace: "nowrap",
                    marginLeft: "1rem",
                  }}
                >
                  {formatDate(suggestion.createdAt)}
                </span>
              </div>

              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  color: "var(--color-ink-muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Suggested by <strong style={{ color: "var(--color-ink)" }}>{suggestion.authorDisplayName}</strong>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--color-ink-light)",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {suggestion.changeNote}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
