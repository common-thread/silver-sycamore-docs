"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Link from "next/link";
import { useState } from "react";

interface VersionHistoryProps {
  documentId: Id<"documents">;
  category: string;
  slug: string;
  currentVersion: number | undefined;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(timestamp);
}

export function VersionHistory({
  documentId,
  category,
  slug,
  currentVersion,
}: VersionHistoryProps) {
  const versions = useQuery(api.versions.listByDocument, { documentId });
  const [isExpanded, setIsExpanded] = useState(false);

  if (!versions || versions.length === 0) {
    return (
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          color: "var(--color-ink-muted)",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        No version history yet
      </div>
    );
  }

  const displayVersions = isExpanded ? versions : versions.slice(0, 5);
  const hasMore = versions.length > 5;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--color-ink)",
            margin: 0,
          }}
        >
          Version History
        </h3>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--color-ink-muted)",
          }}
        >
          {versions.length} version{versions.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Version List */}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {displayVersions.map((version) => {
          const isCurrent = version.version === currentVersion;

          return (
            <li key={version._id}>
              <Link
                href={`/${category}/${slug}/versions/${version.version}`}
                style={{
                  display: "block",
                  padding: "0.625rem 0.75rem",
                  background: isCurrent ? "var(--color-background)" : "transparent",
                  border: "1px solid var(--color-border)",
                  borderRadius: "2px",
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
                {/* Version header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--color-ink)",
                    }}
                  >
                    v{version.version}
                    {isCurrent && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.6875rem",
                          fontWeight: 500,
                          color: "var(--color-accent)",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Current
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {formatRelativeTime(version.createdAt)}
                  </span>
                </div>

                {/* Editor and note */}
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--color-ink-light)",
                  }}
                >
                  {version.editedByName && (
                    <span>by {version.editedByName}</span>
                  )}
                  {version.changeNote && (
                    <span
                      style={{
                        display: "block",
                        marginTop: "0.25rem",
                        fontStyle: "italic",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      "{version.changeNote}"
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Show more/less */}
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginTop: "0.5rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "var(--color-accent)",
            background: "transparent",
            border: "1px dashed var(--color-border)",
            borderRadius: "2px",
            cursor: "pointer",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-background)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {isExpanded ? "Show less" : `Show ${versions.length - 5} more`}
        </button>
      )}
    </div>
  );
}
