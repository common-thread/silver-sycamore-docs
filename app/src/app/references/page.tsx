"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ContentBox } from "@/components/ContentBox";
import PageHeader from "@/components/PageHeader";

export default function ReferencesPage() {
  const documents = useQuery(api.documents.byContentType, { contentType: "reference" });

  return (
    <>
      <PageHeader
        title="References"
        description="Packages, menus, pricing, and venue layouts"
      />
      <ContentBox>
        {documents === undefined ? (
          <p style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
        ) : documents.length === 0 ? (
          <p style={{ color: "var(--color-ink-muted)" }}>No references found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {documents.map((doc) => (
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
