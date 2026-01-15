"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { UserPicker } from "./UserPicker";

interface ShareDialogProps {
  folderId: Id<"personalFolders">;
  folderName: string;
  onClose: () => void;
}

interface SelectedUser {
  id: Id<"users">;
  email?: string;
  name?: string;
  displayName?: string;
}

type Permission = "view" | "comment" | "edit";

const permissionOptions: { value: Permission; label: string }[] = [
  { value: "view", label: "Can view" },
  { value: "comment", label: "Can comment" },
  { value: "edit", label: "Can edit" },
];

export function ShareDialog({ folderId, folderName, onClose }: ShareDialogProps) {
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [permission, setPermission] = useState<Permission>("view");
  const [isSharing, setIsSharing] = useState(false);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);

  const shares = useQuery(api.folderShares.listByFolder, { folderId });
  const shareMutation = useMutation(api.folderShares.share);
  const revokeMutation = useMutation(api.folderShares.revoke);

  // Get IDs of users already shared with
  const sharedUserIds = (shares ?? [])
    .filter((s) => s.sharedWith?.type === "user")
    .map((s) => s.sharedWith!.id as Id<"users">);

  const handleShare = async () => {
    if (!selectedUser) return;

    setIsSharing(true);
    try {
      await shareMutation({
        folderId,
        userId: selectedUser.id,
        permission,
      });
      setSelectedUser(null);
      setPermission("view");
    } catch (error) {
      console.error("Failed to share:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleRevoke = async (shareId: Id<"folderShares">) => {
    setIsRevoking(shareId);
    try {
      await revokeMutation({ shareId });
    } catch (error) {
      console.error("Failed to revoke share:", error);
    } finally {
      setIsRevoking(null);
    }
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
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "2px",
          width: "100%",
          maxWidth: "480px",
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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
            Share "{folderName}"
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem",
              color: "var(--color-ink-light)",
            }}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Add people section */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div style={{ marginBottom: "0.75rem" }}>
            <UserPicker
              onSelect={setSelectedUser}
              excludeIds={sharedUserIds}
              placeholder="Add people by name or email..."
            />
          </div>

          {selectedUser && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.5rem",
                background: "var(--color-background)",
                borderRadius: "2px",
                marginBottom: "0.75rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--color-ink)",
                  }}
                >
                  {selectedUser.displayName || selectedUser.name || selectedUser.email}
                </div>
                {(selectedUser.displayName || selectedUser.name) && selectedUser.email && (
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {selectedUser.email}
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.25rem",
                  color: "var(--color-ink-muted)",
                }}
                aria-label="Remove selection"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as Permission)}
              style={{
                flex: 1,
                padding: "0.625rem 0.75rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "var(--color-ink)",
                background: "var(--color-background)",
                border: "1px solid var(--color-border)",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              {permissionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleShare}
              disabled={!selectedUser || isSharing}
              style={{
                padding: "0.625rem 1.25rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--color-surface)",
                background: selectedUser ? "var(--color-accent)" : "var(--color-ink-muted)",
                border: "none",
                borderRadius: "2px",
                cursor: selectedUser ? "pointer" : "not-allowed",
                opacity: isSharing ? 0.7 : 1,
              }}
            >
              {isSharing ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>

        {/* Current shares section */}
        <div
          style={{
            padding: "1rem",
            flex: 1,
            overflowY: "auto",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--color-ink-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginTop: 0,
              marginBottom: "0.75rem",
            }}
          >
            People with access
          </h3>

          {/* Owner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.5rem 0",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--color-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-surface)",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              You
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-ink)",
                }}
              >
                You (Owner)
              </div>
            </div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--color-accent)",
                padding: "0.25rem 0.5rem",
                background: "var(--color-background)",
                borderRadius: "2px",
              }}
            >
              Owner
            </span>
          </div>

          {/* Shared users */}
          {(shares ?? []).map((share) => {
            if (!share.sharedWith) return null;

            const displayName =
              share.sharedWith.type === "user"
                ? share.sharedWith.name || share.sharedWith.email
                : share.sharedWith.name;

            const initial = displayName?.[0]?.toUpperCase() || "?";

            return (
              <div
                key={share._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--color-ink-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-surface)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {initial}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: "var(--color-ink)",
                    }}
                  >
                    {displayName}
                  </div>
                  {share.sharedWith.type === "user" && share.sharedWith.email && share.sharedWith.name && (
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      {share.sharedWith.email}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--color-ink-light)",
                    padding: "0.25rem 0.5rem",
                    background: "var(--color-background)",
                    borderRadius: "2px",
                  }}
                >
                  {permissionOptions.find((p) => p.value === share.permission)?.label || share.permission}
                </span>
                <button
                  onClick={() => handleRevoke(share._id)}
                  disabled={isRevoking === share._id}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.25rem",
                    color: "var(--color-ink-muted)",
                    opacity: isRevoking === share._id ? 0.5 : 1,
                  }}
                  aria-label="Remove access"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 4L12 12M12 4L4 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            );
          })}

          {(shares ?? []).length === 0 && (
            <div
              style={{
                padding: "1rem 0",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "var(--color-ink-muted)",
                textAlign: "center",
              }}
            >
              Not shared with anyone yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
