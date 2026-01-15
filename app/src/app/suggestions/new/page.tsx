"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { SuggestionForm } from "@/components/SuggestionForm";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentBox } from "@/components/ContentBox";
import Link from "next/link";

export default function NewSuggestionPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get("documentId") as Id<"documents"> | null;

  // Fetch the document info for breadcrumb
  const document = useQuery(
    api.documents.byId,
    documentId ? { id: documentId } : "skip"
  );

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [authLoading, isAuthenticated, router]);

  // Show loading while checking auth
  if (authLoading || !isAuthenticated) {
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

  // No document ID provided
  if (!documentId) {
    return (
      <>
        <Breadcrumb />
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
              No Document Selected
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--color-ink-muted)",
                marginBottom: "1rem",
              }}
            >
              To create a suggestion, please start from a document page.
            </p>
            <Link
              href="/"
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
              Browse Documents
            </Link>
          </div>
        </ContentBox>
      </>
    );
  }

  // Loading document
  if (document === undefined) {
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
            Loading document...
          </div>
        </ContentBox>
      </>
    );
  }

  // Document not found
  if (document === null) {
    return (
      <>
        <Breadcrumb />
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
              Document Not Found
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--color-ink-muted)",
                marginBottom: "1rem",
              }}
            >
              The document you&apos;re trying to suggest edits for doesn&apos;t exist.
            </p>
            <Link
              href="/"
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
              Browse Documents
            </Link>
          </div>
        </ContentBox>
      </>
    );
  }

  const handleSave = (id: Id<"suggestions">) => {
    // Navigate to edit the saved draft
    router.push(`/suggestions/${id}`);
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
          New for &quot;{document.title}&quot;
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
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            Suggest Edit
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ink-muted)",
              margin: "0.5rem 0 0",
            }}
          >
            Propose changes to &quot;{document.title}&quot;
          </p>
        </div>

        {/* Form */}
        <SuggestionForm documentId={documentId} onSave={handleSave} />
      </ContentBox>
    </>
  );
}
