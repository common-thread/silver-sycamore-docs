"use client";

import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

interface PersonalDoc {
  _id: Id<"personalDocuments">;
  title: string;
  content: string;
  sourceDocumentId?: Id<"documents">;
  updatedAt: number;
}

interface PersonalDocListProps {
  documents: PersonalDoc[];
}

export function PersonalDocList({ documents }: PersonalDocListProps) {
  const removeDoc = useMutation(api.personalDocuments.remove);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: Id<"personalDocuments">, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await removeDoc({ id });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 1 ? "Just now" : `${minutes} min ago`;
      }
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    }
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  if (documents.length === 0) {
    return (
      <div
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          style={{ margin: "0 auto 1rem", opacity: 0.3 }}
        >
          <rect
            x="8"
            y="6"
            width="32"
            height="36"
            rx="2"
            stroke="var(--color-ink)"
            strokeWidth="2"
          />
          <line x1="14" y1="16" x2="34" y2="16" stroke="var(--color-ink)" strokeWidth="2" />
          <line x1="14" y1="24" x2="34" y2="24" stroke="var(--color-ink)" strokeWidth="2" />
          <line x1="14" y1="32" x2="26" y2="32" stroke="var(--color-ink)" strokeWidth="2" />
        </svg>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--color-ink)",
            marginBottom: "0.5rem",
          }}
        >
          No documents yet
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
          }}
        >
          Create a new document or copy one from the wiki.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "0.75rem",
      }}
    >
      {documents.map((doc) => (
        <div
          key={doc._id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            transition: "border-color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border-strong)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
          }}
        >
          <Link
            href={`/workspace/${doc._id}`}
            style={{
              flex: 1,
              textDecoration: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* Document icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                <path
                  d="M4 3C4 2.44772 4.44772 2 5 2H11L16 7V17C16 17.5523 15.5523 18 15 18H5C4.44772 18 4 17.5523 4 17V3Z"
                  stroke="var(--color-ink-muted)"
                  strokeWidth="1.2"
                />
                <path d="M11 2V7H16" stroke="var(--color-ink-muted)" strokeWidth="1.2" />
              </svg>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    color: "var(--color-ink)",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {doc.title}
                  {doc.sourceDocumentId && (
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 500,
                        color: "var(--color-accent)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      from wiki
                    </span>
                  )}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--color-ink-muted)",
                    margin: "0.25rem 0 0",
                  }}
                >
                  Updated {formatDate(doc.updatedAt)}
                </p>
              </div>
            </div>
          </Link>

          {/* Actions */}
          <button
            onClick={() => handleDelete(doc._id, doc.title)}
            disabled={deletingId === doc._id}
            style={{
              padding: "0.375rem 0.625rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: deletingId === doc._id ? "var(--color-ink-muted)" : "#b91c1c",
              background: "transparent",
              border: "1px solid transparent",
              borderRadius: "2px",
              cursor: deletingId === doc._id ? "not-allowed" : "pointer",
              opacity: deletingId === doc._id ? 0.5 : 1,
            }}
          >
            {deletingId === doc._id ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
