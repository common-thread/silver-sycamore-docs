"use client";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentBox } from "@/components/ContentBox";
import { ContentTypeRenderer } from "@/components/ContentTypeRenderer";
import { RelatedDocs } from "@/components/RelatedDocs";
import { ShareLinkDialog } from "@/components/ShareLinkDialog";
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
  const { isSignedIn } = useAuth();
  const document = useQuery(api.documents.bySlug, { slug: slug as string });
  const copyToWorkspace = useMutation(api.personalDocuments.copyFromWiki);
  const [showHistory, setShowHistory] = useState(false);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
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
          {isSignedIn && (
            <>
              {/* Share button for procedure/checklist/form types */}
              {(document.contentType === "procedure" ||
                document.contentType === "checklist" ||
                document.contentType === "form") && (
                <button
                  onClick={() => setShowShareDialog(true)}
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
                    cursor: "pointer",
                    transition: "border-color 0.15s ease",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M10 5C11.1046 5 12 4.10457 12 3C12 1.89543 11.1046 1 10 1C8.89543 1 8 1.89543 8 3C8 3.17681 8.02234 3.34836 8.06437 3.51165L5.06437 5.51165C4.60621 5.19008 4.04497 5 3.44444 5C1.99238 5 0.814453 6.17793 0.814453 7.63C0.814453 9.08207 1.99238 10.26 3.44444 10.26C4.04497 10.26 4.60621 10.0699 5.06437 9.74835L8.06437 11.7484C8.02234 11.9116 8 12.0832 8 12.26C8 13.3646 8.89543 14.26 10 14.26C11.1046 14.26 12 13.3646 12 12.26C12 11.1554 11.1046 10.26 10 10.26C9.39947 10.26 8.83823 10.4501 8.38007 10.7717L5.38007 8.77165C5.42211 8.60836 5.44445 8.43681 5.44445 8.26C5.44445 8.08319 5.42211 7.91164 5.38007 7.74835L8.38007 5.74835C8.83823 6.06992 9.39947 6.26 10 6.26C11.1046 6.26 12 5.36457 12 4.26C12 4.17681 11.9923 4.09527 11.9776 4.01565"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Share
                </button>
              )}
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
        <ContentTypeRenderer document={document} />
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

        {isSignedIn ? (
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

      {/* Share Link Dialog */}
      <ShareLinkDialog
        documentId={document._id}
        documentTitle={document.title}
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />
    </>
  );
}
