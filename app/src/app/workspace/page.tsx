"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSearchParams, useRouter } from "next/navigation";
import { PersonalDocList } from "@/components/PersonalDocList";
import { ActivitySidebar } from "@/components/ActivitySidebar";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";

export default function WorkspacePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const folderId = searchParams.get("folder") as Id<"personalFolders"> | null;

  const documents = useQuery(
    api.personalDocuments.list,
    folderId ? { folderId } : {}
  );
  const folder = useQuery(
    api.personalFolders.get,
    folderId ? { id: folderId } : "skip"
  );
  const folderPath = useQuery(
    api.personalFolders.getPath,
    folderId ? { id: folderId } : "skip"
  );

  const createDoc = useMutation(api.personalDocuments.create);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDoc = async () => {
    setIsCreating(true);
    try {
      const docId = await createDoc({
        title: "Untitled Document",
        content: "",
        folderId: folderId ?? undefined,
      });
      router.push(`/workspace/${docId}`);
    } finally {
      setIsCreating(false);
    }
  };

  const currentFolderName = folder?.name ?? "All Documents";

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
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div>
          {/* Folder path breadcrumbs */}
          {folderPath && folderPath.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--color-ink-muted)",
              }}
            >
              <button
                onClick={() => router.push("/workspace")}
                style={{
                  padding: 0,
                  background: "none",
                  border: "none",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  color: "inherit",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Workspace
              </button>
              {folderPath.map((f, idx) => (
                <span key={f._id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: "var(--color-ink-muted)" }}>›</span>
                  {idx === folderPath.length - 1 ? (
                    <span style={{ color: "var(--color-ink-light)" }}>{f.name}</span>
                  ) : (
                    <button
                      onClick={() => router.push(`/workspace?folder=${f._id}`)}
                      style={{
                        padding: 0,
                        background: "none",
                        border: "none",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        color: "inherit",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      {f.name}
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            {currentFolderName}
          </h1>
        </div>

        <button
          onClick={handleCreateDoc}
          disabled={isCreating}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "var(--color-surface)",
            background: "var(--color-accent)",
            border: "none",
            borderRadius: "2px",
            cursor: isCreating ? "not-allowed" : "pointer",
            opacity: isCreating ? 0.6 : 1,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3V13M3 8H13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {isCreating ? "Creating..." : "New Document"}
        </button>
      </div>

      {/* Document list */}
      {documents === undefined ? (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
          }}
        >
          Loading...
        </div>
      ) : (
        <PersonalDocList documents={documents} />
      )}

      {/* Activity Sidebar Section */}
      <div
        style={{
          marginTop: "1.5rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <ActivitySidebar limit={5} />
      </div>
    </div>
  );
}
