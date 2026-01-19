"use client";

import { Suspense } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { FolderTree } from "@/components/FolderTree";
import { ContentBox } from "@/components/ContentBox";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function FolderTreeWithSuspense({ folders }: { folders: { _id: string; name: string; parentId?: string }[] }) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            padding: "1rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "var(--color-ink-muted)",
            textAlign: "center",
          }}
        >
          Loading folders...
        </div>
      }
    >
      <FolderTree folders={folders as any} />
    </Suspense>
  );
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSharedPage = pathname === "/workspace/shared";

  const folders = useQuery(api.personalFolders.listAll);
  const documents = useQuery(api.personalDocuments.listAll);
  const sharedFoldersRaw = useQuery(api.folderShares.listSharedWithMe);
  const sharedFolderCount = sharedFoldersRaw?.filter(Boolean).length ?? 0;

  const createFolder = useMutation(api.personalFolders.create);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    await createFolder({ name: newFolderName.trim() });
    setNewFolderName("");
    setIsCreatingFolder(false);
  };

  const folderCount = folders?.length ?? 0;
  const docCount = documents?.length ?? 0;

  return (
    <>
      <Breadcrumb categoryName="My Workspace" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            padding: "1rem",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                margin: 0,
              }}
            >
              Folders
            </h2>
            <button
              onClick={() => setIsCreatingFolder(true)}
              style={{
                padding: "0.25rem 0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--color-accent)",
                background: "transparent",
                border: "1px solid var(--color-accent)",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              + New
            </button>
          </div>

          {/* New folder input */}
          {isCreatingFolder && (
            <div style={{ marginBottom: "0.75rem" }}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder();
                  if (e.key === "Escape") {
                    setIsCreatingFolder(false);
                    setNewFolderName("");
                  }
                }}
                placeholder="Folder name"
                autoFocus
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  border: "1px solid var(--color-border)",
                  borderRadius: "2px",
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  onClick={handleCreateFolder}
                  style={{
                    flex: 1,
                    padding: "0.375rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--color-surface)",
                    background: "var(--color-accent)",
                    border: "none",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName("");
                  }}
                  style={{
                    flex: 1,
                    padding: "0.375rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--color-ink-muted)",
                    background: "transparent",
                    border: "1px solid var(--color-border)",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Folder tree */}
          <FolderTreeWithSuspense folders={folders ?? []} />

          {/* Shared with me link */}
          <Link
            href="/workspace/shared"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem",
              marginTop: "1rem",
              color: isSharedPage ? "var(--color-accent)" : "var(--color-ink-light)",
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: isSharedPage ? 600 : 400,
              borderTop: "1px solid var(--color-border)",
              paddingTop: "1rem",
              background: isSharedPage ? "var(--color-background)" : "transparent",
              borderRadius: "2px",
            }}
          >
            {/* Users/share icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="6" cy="5" r="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 13C2 10.5 3.5 9 6 9C8.5 9 10 10.5 10 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="11" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M14 12C14 10.3 13 9.5 11 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Shared with me
            {sharedFolderCount > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  padding: "0.125rem 0.375rem",
                  background: "var(--color-background)",
                  borderRadius: "2px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "var(--color-ink-muted)",
                }}
              >
                {sharedFolderCount}
              </span>
            )}
          </Link>

          {/* Stats */}
          <div
            style={{
              marginTop: "0.75rem",
              paddingTop: "0.75rem",
              borderTop: "1px solid var(--color-border)",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--color-ink-muted)",
            }}
          >
            {folderCount} folders · {docCount} documents
          </div>
        </div>

        {/* Main content */}
        <div>{children}</div>
      </div>
    </>
  );
}
