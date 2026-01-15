"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";

export default function SharedWithMePage() {
  const sharedFoldersRaw = useQuery(api.folderShares.listSharedWithMe);

  // Filter out null values and narrow type
  const sharedFolders = sharedFoldersRaw?.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        padding: "1.5rem",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.25rem",
          fontWeight: 600,
          marginBottom: "1.5rem",
          color: "var(--color-ink)",
        }}
      >
        Shared with me
      </h1>

      {sharedFolders === undefined && (
        <p
          style={{
            color: "var(--color-ink-muted)",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
          }}
        >
          Loading...
        </p>
      )}

      {sharedFolders?.length === 0 && (
        <p
          style={{
            color: "var(--color-ink-muted)",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
          }}
        >
          No folders have been shared with you yet.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {sharedFolders?.map((item) => (
          <Link
            key={item._id}
            href={`/workspace?folder=${item._id}&shared=true`}
            style={{
              display: "block",
              padding: "1rem",
              border: "1px solid var(--color-border)",
              borderRadius: "2px",
              textDecoration: "none",
              transition: "background 0.1s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-background)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {/* Folder icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                <path
                  d="M2 4.5C2 3.67 2.67 3 3.5 3H6L7.5 5H12.5C13.33 5 14 5.67 14 6.5V11.5C14 12.33 13.33 13 12.5 13H3.5C2.67 13 2 12.33 2 11.5V4.5Z"
                  stroke="var(--color-accent)"
                  strokeWidth="1.2"
                  fill="var(--color-accent)"
                  fillOpacity="0.1"
                />
              </svg>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  color: "var(--color-ink)",
                }}
              >
                {item.name}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginTop: "0.375rem",
                marginLeft: "1.625rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-ink-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Shared by {item.owner?.name || item.owner?.email || "Unknown"}
              </span>
              <span
                style={{
                  padding: "0.125rem 0.5rem",
                  background: "var(--color-background)",
                  borderRadius: "2px",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-body)",
                  color: "var(--color-ink-light)",
                }}
              >
                {item.permission === "edit"
                  ? "Can edit"
                  : item.permission === "comment"
                    ? "Can comment"
                    : "Can view"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
