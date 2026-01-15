"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { FolderTree } from "@/components/FolderTree";
import { ContentBox } from "@/components/ContentBox";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useState } from "react";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const folders = useQuery(api.personalFolders.listAll);
  const documents = useQuery(api.personalDocuments.listAll);
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
          <FolderTree folders={folders ?? []} />

          {/* Stats */}
          <div
            style={{
              marginTop: "1rem",
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
