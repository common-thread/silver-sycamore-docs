"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

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
      <div key={folder._id}>
        <Link
          href={`/workspace?folder=${folder._id}`}
          style={{
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
        {children.length > 0 && (
          <div>
            {children.map((child) => renderFolder(child, depth + 1))}
          </div>
        )}
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
  );
}
