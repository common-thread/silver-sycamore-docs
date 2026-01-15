"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { PersonalDocEditor } from "@/components/PersonalDocEditor";
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";

export default function PersonalDocPage() {
  const { docId } = useParams();
  const router = useRouter();
  const document = useQuery(api.personalDocuments.get, {
    id: docId as Id<"personalDocuments">,
  });
  const sourceDoc = useQuery(
    api.documents.byId,
    document?.sourceDocumentId ? { id: document.sourceDocumentId } : "skip"
  );
  const removeDoc = useMutation(api.personalDocuments.remove);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!document) return;
    if (!confirm(`Delete "${document.title}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await removeDoc({ id: document._id });
      router.push("/workspace");
    } catch (error) {
      console.error("Failed to delete:", error);
      setIsDeleting(false);
    }
  };

  if (document === undefined) {
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

  if (document === null) {
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
          Document Not Found
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
            marginBottom: "1rem",
          }}
        >
          This document may have been deleted or you don't have access.
        </p>
        <Link
          href="/workspace"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-accent)",
            textDecoration: "none",
          }}
        >
          ← Back to Workspace
        </Link>
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
        }}
      >
        <Link
          href={document.folderId ? `/workspace?folder=${document.folderId}` : "/workspace"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "var(--color-ink-muted)",
            textDecoration: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 4L6 8L10 12"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Workspace
        </Link>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          style={{
            padding: "0.375rem 0.75rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: isDeleting ? "var(--color-ink-muted)" : "#b91c1c",
            background: "transparent",
            border: "1px solid transparent",
            borderRadius: "2px",
            cursor: isDeleting ? "not-allowed" : "pointer",
            opacity: isDeleting ? 0.5 : 1,
          }}
        >
          {isDeleting ? "Deleting..." : "Delete Document"}
        </button>
      </div>

      {/* Source document link */}
      {document.sourceDocumentId && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            background: "var(--color-background)",
            border: "1px solid var(--color-border)",
            borderRadius: "2px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M6 4H3C2.44772 4 2 4.44772 2 5V11C2 11.5523 2.44772 12 3 12H9C9.55228 12 10 11.5523 10 11V8"
              stroke="var(--color-accent)"
              strokeWidth="1.2"
            />
            <path
              d="M5 9L12 2M12 2H8M12 2V6"
              stroke="var(--color-accent)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--color-ink-muted)",
            }}
          >
            Copied from:{" "}
            {sourceDoc ? (
              <Link
                href={`/${sourceDoc.category}/${sourceDoc.slug}`}
                style={{ color: "var(--color-accent)", textDecoration: "none" }}
              >
                {sourceDoc.title}
              </Link>
            ) : (
              <span style={{ fontStyle: "italic" }}>Original removed</span>
            )}
          </span>
        </div>
      )}

      {/* Editor */}
      <PersonalDocEditor
        docId={document._id}
        initialTitle={document.title}
        initialContent={document.content}
      />
    </div>
  );
}
