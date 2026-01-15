"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Link from "next/link";

interface RelatedDocsProps {
  documentId: Id<"documents">;
  category: string;
}

export function RelatedDocs({ documentId, category }: RelatedDocsProps) {
  const relatedDocs = useQuery(api.documents.related, {
    documentId,
    category,
    limit: 5,
  });

  // Don't render if loading or no related docs
  if (!relatedDocs || relatedDocs.length === 0) {
    return null;
  }

  return (
    <aside
      style={{
        marginTop: "2rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--color-ink)",
          marginBottom: "0.75rem",
          letterSpacing: "-0.01em",
        }}
      >
        Related Documents
      </h3>

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
        {relatedDocs.map((doc) => (
          <li key={doc._id}>
            <Link
              href={`/${doc.category}/${doc.slug}`}
              style={{
                display: "block",
                padding: "0.625rem 0.875rem",
                background: "var(--color-background)",
                border: "1px solid var(--color-border)",
                borderRadius: "2px",
                textDecoration: "none",
                transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent)";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--color-ink)",
                }}
              >
                {doc.title}
              </span>
              {doc.subcategory && (
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "var(--color-ink-muted)",
                  }}
                >
                  {doc.subcategory}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
