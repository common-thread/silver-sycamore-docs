"use client";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentBox } from "@/components/ContentBox";
import { DocumentViewer } from "@/components/DocumentViewer";
import { RelatedDocs } from "@/components/RelatedDocs";
import { VersionBadge } from "@/components/VersionBadge";
import { VersionHistory } from "@/components/VersionHistory";
import { FolderPicker } from "@/components/FolderPicker";
import { CommentSection } from "@/components/CommentSection";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";

export default function DocumentPage() {
  const { slug, category } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const document = useQuery(api.documents.bySlug, { slug: slug as string });
  const copyToWorkspace = useMutation(api.personalDocuments.copyFromWiki);
  const [showHistory, setShowHistory] = useState(false);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async (folderId: Id<"personalFolders"> | null) => {
    if (!document) return;
    setIsCopying(true);
    try {
      const newDocId = await copyToWorkspace({
        documentId: document._id,
        folderId: folderId ?? undefined,
      });
      setShowFolderPicker(false);
      router.push(`/workspace/${newDocId}`);
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy document. Please try again.");
    } finally {
      setIsCopying(false);
    }
  };

  if (document === undefined) {
    return (
      <>
        <Breadcrumb />
        <ContentBox>
          <div style={{ color: "var(--color-ink-muted)" }}>Loading document...</div>
        </ContentBox>
      </>
    );
  }

  if (document === null) {
    return (
      <>
        <Breadcrumb />
        <ContentBox>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              marginBottom: "1rem",
            }}
          >
            Document Not Found
          </h1>
          <p style={{ color: "var(--color-ink-muted)" }}>
            The requested document could not be found.
          </p>
        </ContentBox>
      </>
    );
  }

  return (
    <>
      {/* Breadcrumb with actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <Breadcrumb documentTitle={document.title} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {isAuthenticated && (
            <>
              <Link
                href={`/suggestions/new?documentId=${document._id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.375rem 0.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
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
                    d="M10.5 1.5L12.5 3.5L5 11H3V9L10.5 1.5Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Suggest Edit
              </Link>
              <button
                onClick={() => setShowFolderPicker(true)}
                disabled={isCopying}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.375rem 0.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "var(--color-ink-light)",
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  borderRadius: "2px",
                  cursor: isCopying ? "not-allowed" : "pointer",
                  opacity: isCopying ? 0.6 : 1,
                  transition: "border-color 0.15s ease",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M5 3H3C2.44772 3 2 3.44772 2 4V11C2 11.5523 2.44772 12 3 12H10C10.5523 12 11 11.5523 11 11V9"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M7 7L12 2M12 2H9M12 2V5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isCopying ? "Copying..." : "Copy to Workspace"}
              </button>
            </>
          )}
          <VersionBadge
            version={document.version}
            onClick={() => setShowHistory(!showHistory)}
          />
        </div>
      </div>

      {/* Version History Panel (collapsible) */}
      {showHistory && (
        <ContentBox>
          <VersionHistory
            documentId={document._id}
            category={document.category}
            slug={document.slug}
            currentVersion={document.version}
          />
        </ContentBox>
      )}

      {/* Main Content */}
      <ContentBox>
        <DocumentViewer document={document} />
        <RelatedDocs documentId={document._id} category={document.category} />
      </ContentBox>

      {/* Comments Section */}
      <ContentBox>
        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "var(--color-border)",
            marginBottom: "2rem",
          }}
        />

        {isAuthenticated ? (
          <div style={{ maxWidth: "65ch" }}>
            <CommentSection documentId={document._id} />
          </div>
        ) : (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              background: "var(--color-surface-dim)",
              borderRadius: "4px",
              border: "1px solid var(--color-border)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                marginBottom: "0.5rem",
              }}
            >
              Discussion
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--color-ink-muted)",
                margin: 0,
              }}
            >
              Sign in to view and add comments
            </p>
          </div>
        )}
      </ContentBox>

      {/* Folder Picker Modal */}
      {showFolderPicker && (
        <FolderPicker
          title="Copy to Workspace"
          onSelect={handleCopy}
          onCancel={() => setShowFolderPicker(false)}
        />
      )}
    </>
  );
}
