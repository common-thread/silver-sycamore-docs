"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { ShareDialog } from "./ShareDialog";

interface Folder {
  _id: Id<"personalFolders">;
  name: string;
  parentId?: Id<"personalFolders">;
}

interface FolderTreeProps {
  folders: Folder[];
}

export function FolderTree({ folders }: FolderTreeProps) {
  const searchParams = useSearchParams();
  const currentFolderId = searchParams.get("folder");
  const [sharingFolder, setSharingFolder] = useState<{ id: Id<"personalFolders">; name: string } | null>(null);

  // Build tree structure
  const rootFolders = folders.filter((f) => !f.parentId);
  const childrenMap = new Map<string, Folder[]>();

  folders.forEach((folder) => {
    if (folder.parentId) {
      const existing = childrenMap.get(folder.parentId) ?? [];
      childrenMap.set(folder.parentId, [...existing, folder]);
    }
  });

  const renderFolder = (folder: Folder, depth: number = 0) => {
    const isActive = currentFolderId === folder._id;
    const children = childrenMap.get(folder._id) ?? [];

    return (
      <div key={folder._id} className="folder-item">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <Link
            href={`/workspace?folder=${folder._id}`}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem",
              paddingLeft: `${0.5 + depth * 1}rem`,
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "var(--color-accent)" : "var(--color-ink-light)",
              textDecoration: "none",
              background: isActive ? "var(--color-background)" : "transparent",
              borderRadius: "2px",
              transition: "background 0.1s ease",
            }}
          >
            {/* Folder icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <path
                d="M2 4.5C2 3.67 2.67 3 3.5 3H6L7.5 5H12.5C13.33 5 14 5.67 14 6.5V11.5C14 12.33 13.33 13 12.5 13H3.5C2.67 13 2 12.33 2 11.5V4.5Z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill={isActive ? "var(--color-accent)" : "none"}
                fillOpacity={isActive ? 0.1 : 0}
              />
            </svg>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {folder.name}
            </span>
          </Link>
          {/* Share button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSharingFolder({ id: folder._id, name: folder.name });
            }}
            title="Share folder"
            className="share-button"
            style={{
              padding: "0.375rem",
              background: "transparent",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
              color: "var(--color-ink-muted)",
              opacity: 0,
              transition: "opacity 0.15s ease, color 0.15s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5.5 7L10.5 5M5.5 9L10.5 11" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
        {children.length > 0 && (
          <div>
            {children.map((child) => renderFolder(child, depth + 1))}
          </div>
        )}
        <style jsx>{`
          .folder-item:hover .share-button {
            opacity: 1;
          }
          .share-button:hover {
            color: var(--color-accent) !important;
          }
        `}</style>
      </div>
    );
  };

  if (folders.length === 0) {
    return (
      <div
        style={{
          padding: "1rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          color: "var(--color-ink-muted)",
          textAlign: "center",
        }}
      >
        No folders yet
      </div>
    );
  }

  return (
    <>
      <div>
        {/* All Documents link */}
        <Link
          href="/workspace"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            fontWeight: !currentFolderId ? 600 : 400,
            color: !currentFolderId ? "var(--color-accent)" : "var(--color-ink-light)",
            textDecoration: "none",
            background: !currentFolderId ? "var(--color-background)" : "transparent",
            borderRadius: "2px",
            marginBottom: "0.25rem",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect
              x="2"
              y="3"
              width="12"
              height="10"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <line x1="2" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          All Documents
        </Link>

        {/* Folder tree */}
        {rootFolders.map((folder) => renderFolder(folder))}
      </div>

      {/* Share dialog */}
      {sharingFolder && (
        <ShareDialog
          folderId={sharingFolder.id}
          folderName={sharingFolder.name}
          onClose={() => setSharingFolder(null)}
        />
      )}
    </>
  );
}
