"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchResultsProps {
  query: string;
  selectedIndex: number;
  onSelect: () => void;
}

export function SearchResults({ query, selectedIndex, onSelect }: SearchResultsProps) {
  const results = useQuery(api.documents.search, { searchQuery: query });
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    if (results && selectedIndex >= 0 && selectedIndex < results.length) {
      const handleEnter = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          const doc = results[selectedIndex];
          router.push(`/${doc.category}/${doc.slug}`);
          onSelect();
        }
      };
      document.addEventListener("keydown", handleEnter);
      return () => document.removeEventListener("keydown", handleEnter);
    }
  }, [results, selectedIndex, router, onSelect]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const items = listRef.current.querySelectorAll("li");
      items[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Extract snippet from content
  const getSnippet = (content: string, maxLength: number = 120): string => {
    // Strip markdown formatting
    const plain = content
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*|__/g, "")
      .replace(/\*|_/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\n+/g, " ")
      .trim();

    if (plain.length <= maxLength) return plain;
    return plain.substring(0, maxLength).trim() + "...";
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        left: 0,
        right: 0,
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "2px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        maxHeight: "400px",
        overflowY: "auto",
        zIndex: 100,
      }}
    >
      {results === undefined ? (
        <div
          style={{
            padding: "1rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
            textAlign: "center",
          }}
        >
          Searching...
        </div>
      ) : results.length === 0 ? (
        <div
          style={{
            padding: "1rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
            textAlign: "center",
          }}
        >
          No documents found for "{query}"
        </div>
      ) : (
        <ul
          ref={listRef}
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {results.slice(0, 10).map((doc, index) => (
            <li key={doc._id}>
              <Link
                href={`/${doc.category}/${doc.slug}`}
                onClick={onSelect}
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  background: index === selectedIndex ? "var(--color-background)" : "transparent",
                  borderBottom: "1px solid var(--color-border)",
                  transition: "background 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-background)";
                }}
                onMouseLeave={(e) => {
                  if (index !== selectedIndex) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {/* Title and Category */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: "var(--color-ink)",
                    }}
                  >
                    {doc.title}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.6875rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: "var(--color-ink-muted)",
                      padding: "0.125rem 0.375rem",
                      background: "var(--color-background)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "2px",
                    }}
                  >
                    {doc.category}
                  </span>
                </div>

                {/* Snippet */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--color-ink-light)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {getSnippet(doc.content)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
