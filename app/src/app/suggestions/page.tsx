"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SuggestionList } from "@/components/SuggestionList";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentBox } from "@/components/ContentBox";
import Link from "next/link";

export default function SuggestionsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading while checking auth
  if (isLoading || !isAuthenticated) {
    return (
      <>
        <Breadcrumb />
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
      </>
    );
  }

  return (
    <>
      <Breadcrumb />
      <ContentBox>
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
              My Suggestions
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--color-ink-muted)",
                margin: "0.5rem 0 0",
              }}
            >
              Proposed changes to official documents
            </p>
          </div>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-ink-light)",
              background: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: "2px",
              textDecoration: "none",
              transition: "border-color 0.15s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7H12M2 7L6 3M2 7L6 11"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Browse Documents
          </Link>
        </div>

        {/* Suggestion list */}
        <SuggestionList />
      </ContentBox>
    </>
  );
}
