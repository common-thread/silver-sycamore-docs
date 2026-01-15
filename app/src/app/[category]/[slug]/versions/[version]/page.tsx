"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentBox } from "@/components/ContentBox";
import { VersionCompare } from "@/components/VersionCompare";
import { usePermissions } from "@/hooks/usePermissions";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function VersionDetailPage() {
  const { slug, category, version: versionParam } = useParams();
  const router = useRouter();
  const versionNumber = parseInt(versionParam as string, 10);

  const document = useQuery(api.documents.bySlug, { slug: slug as string });
  const versionData = useQuery(
    api.versions.getVersion,
    document ? { documentId: document._id, version: versionNumber } : "skip"
  );

  const { isManager, isAdmin } = usePermissions();
  const canRestore = isManager || isAdmin;

  const restoreVersion = useMutation(api.versions.restoreVersion);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  if (document === undefined || versionData === undefined) {
    return (
      <>
        <Breadcrumb />
        <ContentBox>
          <div style={{ color: "var(--color-ink-muted)" }}>Loading...</div>
        </ContentBox>
      </>
    );
  }

  if (document === null) {
    return (
      <>
        <Breadcrumb />
        <ContentBox>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600 }}>
            Document Not Found
          </h1>
        </ContentBox>
      </>
    );
  }

  if (versionData === null) {
    return (
      <>
        <Breadcrumb documentTitle={document.title} />
        <ContentBox>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600 }}>
            Version Not Found
          </h1>
          <p style={{ color: "var(--color-ink-muted)" }}>
            Version {versionNumber} does not exist for this document.
          </p>
          <Link
            href={`/${category}/${slug}`}
            style={{ color: "var(--color-accent)", textDecoration: "none" }}
          >
            ← Back to current version
          </Link>
        </ContentBox>
      </>
    );
  }

  const handleRestore = async () => {
    if (!canRestore || isRestoring) return;

    const confirmed = window.confirm(
      `Restore document to version ${versionNumber}? This will create a new version with the old content.`
    );
    if (!confirmed) return;

    setIsRestoring(true);
    try {
      await restoreVersion({ documentId: document._id, version: versionNumber });
      router.push(`/${category}/${slug}`);
    } catch (error) {
      console.error("Failed to restore:", error);
      alert("Failed to restore version. Please try again.");
    } finally {
      setIsRestoring(false);
    }
  };

  const isCurrent = versionNumber === document.version;

  return (
    <>
      <Breadcrumb documentTitle={`${document.title} (v${versionNumber})`} />

      <ContentBox>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                marginBottom: "0.25rem",
              }}
            >
              Version {versionNumber}
              {isCurrent && (
                <span
                  style={{
                    marginLeft: "0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--color-accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Current
                </span>
              )}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--color-ink-muted)",
                margin: 0,
              }}
            >
              {new Date(versionData.createdAt).toLocaleString()}
              {versionData.editedByName && ` by ${versionData.editedByName}`}
            </p>
            {versionData.changeNote && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontStyle: "italic",
                  color: "var(--color-ink-light)",
                  marginTop: "0.25rem",
                }}
              >
                "{versionData.changeNote}"
              </p>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href={`/${category}/${slug}`}
              style={{
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
              View Current
            </Link>

            <button
              onClick={() => setShowDiff(!showDiff)}
              style={{
                padding: "0.5rem 1rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: showDiff ? "var(--color-surface)" : "var(--color-ink-light)",
                background: showDiff ? "var(--color-ink)" : "transparent",
                border: "1px solid var(--color-border)",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {showDiff ? "Hide Diff" : "Compare to Current"}
            </button>

            {canRestore && !isCurrent && (
              <button
                onClick={handleRestore}
                disabled={isRestoring}
                style={{
                  padding: "0.5rem 1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-surface)",
                  background: "var(--color-accent)",
                  border: "none",
                  borderRadius: "2px",
                  cursor: isRestoring ? "not-allowed" : "pointer",
                  opacity: isRestoring ? 0.6 : 1,
                  transition: "opacity 0.15s ease",
                }}
              >
                {isRestoring ? "Restoring..." : "Restore This Version"}
              </button>
            )}
          </div>
        </div>

        {/* Diff View */}
        {showDiff && (
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                marginBottom: "0.75rem",
              }}
            >
              Changes from v{versionNumber} to Current
            </h2>
            <VersionCompare
              oldContent={versionData.content}
              newContent={document.content}
              oldTitle={versionData.title}
              newTitle={document.title}
            />
          </div>
        )}

        {/* Version Content */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              marginBottom: "0.75rem",
            }}
          >
            {showDiff ? "Version Content" : versionData.title}
          </h2>
          <div
            style={{
              padding: "1rem",
              background: "var(--color-background)",
              border: "1px solid var(--color-border)",
              borderRadius: "2px",
            }}
          >
            <div className="prose">
              <ReactMarkdown>{versionData.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </ContentBox>
    </>
  );
}
