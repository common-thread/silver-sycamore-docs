"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ContentBox } from "@/components/ContentBox";
import PageHeader from "@/components/PageHeader";

type ContentType = "procedure" | "reference" | "form" | "checklist" | "guide";

interface ContextCatalogProps {
  title: string;
  description: string;
  categories: string[];
}

export default function ContextCatalog({
  title,
  description,
  categories,
}: ContextCatalogProps) {
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);

  const documents = useQuery(api.documents.byCategories, { categories });

  // Get unique content types that exist in the results
  const availableTypes = useMemo(() => {
    if (!documents) return [];
    const types = new Set<ContentType>();
    for (const doc of documents) {
      if (doc.contentType) {
        types.add(doc.contentType);
      }
    }
    return Array.from(types).sort();
  }, [documents]);

  // Filter documents by selected content type (client-side)
  const filteredDocuments = useMemo(() => {
    if (!documents) return [];
    if (!selectedType) return documents;
    return documents.filter((doc) => doc.contentType === selectedType);
  }, [documents, selectedType]);

  // Content type display labels
  const typeLabels: Record<ContentType, string> = {
    procedure: "Procedures",
    reference: "References",
    form: "Forms",
    checklist: "Checklists",
    guide: "Guides",
  };

  return (
    <>
      <PageHeader title={title} description={description} />
      <ContentBox>
        {/* Type filter chips */}
        {availableTypes.length > 1 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-2)",
              marginBottom: "var(--space-4)",
              paddingBottom: "var(--space-4)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            {/* All chip */}
            <button
              onClick={() => setSelectedType(null)}
              style={{
                padding: "var(--space-1) var(--space-3)",
                borderRadius: "9999px",
                fontSize: "var(--text-sm)",
                fontFamily: "var(--font-body)",
                fontWeight: "var(--font-medium)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                border: selectedType === null ? "none" : "1px solid var(--color-border)",
                backgroundColor: selectedType === null ? "var(--color-accent)" : "transparent",
                color: selectedType === null ? "white" : "var(--color-ink)",
              }}
            >
              All
            </button>
            {/* Type chips */}
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: "var(--space-1) var(--space-3)",
                  borderRadius: "9999px",
                  fontSize: "var(--text-sm)",
                  fontFamily: "var(--font-body)",
                  fontWeight: "var(--font-medium)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  border: selectedType === type ? "none" : "1px solid var(--color-border)",
                  backgroundColor: selectedType === type ? "var(--color-accent)" : "transparent",
                  color: selectedType === type ? "white" : "var(--color-ink)",
                }}
              >
                {typeLabels[type]}
              </button>
            ))}
          </div>
        )}

        {/* Document list */}
        {documents === undefined ? (
          <p style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
        ) : filteredDocuments.length === 0 ? (
          <p style={{ color: "var(--color-ink-muted)" }}>No documents found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {filteredDocuments.map((doc) => (
              <li
                key={doc._id}
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  padding: "var(--space-4) 0",
                }}
              >
                <Link
                  href={`/${doc.category}/${doc.slug}`}
                  style={{
                    color: "var(--color-ink)",
                    textDecoration: "none",
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-base)",
                    fontWeight: "var(--font-medium)",
                  }}
                >
                  {doc.title}
                </Link>
                {doc.description && (
                  <p
                    style={{
                      color: "var(--color-ink-muted)",
                      fontSize: "var(--text-sm)",
                      margin: "var(--space-1) 0 0 0",
                    }}
                  >
                    {doc.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </ContentBox>
    </>
  );
}
