"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

interface Folder {
  _id: Id<"personalFolders">;
  name: string;
  parentId?: Id<"personalFolders">;
}

interface FolderPickerProps {
  onSelect: (folderId: Id<"personalFolders"> | null) => void;
  onCancel: () => void;
  title?: string;
}

export function FolderPicker({ onSelect, onCancel, title = "Select Destination" }: FolderPickerProps) {
  const folders = useQuery(api.personalFolders.listAll);
  const [selectedId, setSelectedId] = useState<Id<"personalFolders"> | null>(null);

  // Build tree structure
  const rootFolders = (folders ?? []).filter((f) => !f.parentId);
  const childrenMap = new Map<string, Folder[]>();

  (folders ?? []).forEach((folder) => {
    if (folder.parentId) {
      const existing = childrenMap.get(folder.parentId) ?? [];
      childrenMap.set(folder.parentId, [...existing, folder]);
    }
  });

  const renderFolder = (folder: Folder, depth: number = 0) => {
    const isSelected = selectedId === folder._id;
    const children = childrenMap.get(folder._id) ?? [];

    return (
      <div key={folder._id}>
        <button
          onClick={() => setSelectedId(isSelected ? null : folder._id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "0.5rem",
            paddingLeft: `${0.5 + depth * 1}rem`,
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            fontWeight: isSelected ? 600 : 400,
            color: isSelected ? "var(--color-accent)" : "var(--color-ink-light)",
            textAlign: "left",
            background: isSelected ? "var(--color-background)" : "transparent",
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
            transition: "background 0.1s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path
              d="M2 4.5C2 3.67 2.67 3 3.5 3H6L7.5 5H12.5C13.33 5 14 5.67 14 6.5V11.5C14 12.33 13.33 13 12.5 13H3.5C2.67 13 2 12.33 2 11.5V4.5Z"
              stroke="currentColor"
              strokeWidth="1.2"
              fill={isSelected ? "var(--color-accent)" : "none"}
              fillOpacity={isSelected ? 0.1 : 0}
            />
          </svg>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {folder.name}
          </span>
        </button>
        {children.length > 0 && (
          <div>{children.map((child) => renderFolder(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "2px",
          width: "100%",
          maxWidth: "360px",
          maxHeight: "80vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            {title}
          </h2>
        </div>

        {/* Folder list */}
        <div
          style={{
            padding: "0.5rem",
            overflowY: "auto",
            flex: 1,
            minHeight: "200px",
          }}
        >
          {/* Root option */}
          <button
            onClick={() => setSelectedId(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "0.5rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: selectedId === null ? 600 : 400,
              color: selectedId === null ? "var(--color-accent)" : "var(--color-ink-light)",
              textAlign: "left",
              background: selectedId === null ? "var(--color-background)" : "transparent",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
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
            Workspace Root
          </button>

          {/* Folders */}
          {rootFolders.map((folder) => renderFolder(folder))}

          {(folders ?? []).length === 0 && (
            <p
              style={{
                padding: "1rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "var(--color-ink-muted)",
                textAlign: "center",
              }}
            >
              No folders yet. Document will be saved to workspace root.
            </p>
          )}
        </div>

        {/* Actions */}
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "0.625rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-ink-light)",
              background: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSelect(selectedId)}
            style={{
              padding: "0.625rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-surface)",
              background: "var(--color-accent)",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            Copy Here
          </button>
        </div>
      </div>
    </div>
  );
}
