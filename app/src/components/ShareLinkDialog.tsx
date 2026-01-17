"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { UserPicker } from "./UserPicker";
import Select from "@/components/ui/Select";

interface ShareLinkDialogProps {
  documentId: Id<"documents">;
  documentTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

interface SelectedUser {
  id: Id<"users">;
  email?: string;
  name?: string;
  displayName?: string;
}

type ShareType = "internal" | "external";
type ExpirationOption = "never" | "1day" | "7days" | "30days";

const shareTypeOptions = [
  { value: "internal", label: "Internal (Staff only)" },
  { value: "external", label: "External (Anyone with link)" },
];

const expirationOptions = [
  { value: "never", label: "Never" },
  { value: "1day", label: "1 day" },
  { value: "7days", label: "7 days" },
  { value: "30days", label: "30 days" },
];

function getExpirationTimestamp(option: ExpirationOption): number | undefined {
  const now = Date.now();
  switch (option) {
    case "1day":
      return now + 24 * 60 * 60 * 1000;
    case "7days":
      return now + 7 * 24 * 60 * 60 * 1000;
    case "30days":
      return now + 30 * 24 * 60 * 60 * 1000;
    default:
      return undefined;
  }
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(timestamp);
}

export function ShareLinkDialog({
  documentId,
  documentTitle,
  isOpen,
  onClose,
}: ShareLinkDialogProps) {
  // Form state
  const [shareType, setShareType] = useState<ShareType>("external");
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const [routeToUsers, setRouteToUsers] = useState<SelectedUser[]>([]);
  const [expiration, setExpiration] = useState<ExpirationOption>("never");
  const [maxUses, setMaxUses] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Current user for defaults
  const currentUser = useQuery(api.users.getCurrentUser);

  // Queries and mutations
  const existingLinks = useQuery(api.sharing.getDocumentShareLinks, { documentId });
  const createLinkMutation = useMutation(api.sharing.createShareLink);
  const revokeLinkMutation = useMutation(api.sharing.revokeShareLink);

  // Get IDs of users already selected for sharing (internal)
  const selectedUserIds = selectedUsers.map((u) => u.id);
  const routeToUserIds = routeToUsers.map((u) => u.id);

  // Handle adding a user to share with (internal)
  const handleAddShareUser = (user: SelectedUser) => {
    if (!selectedUserIds.includes(user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Handle removing a user from share list
  const handleRemoveShareUser = (userId: Id<"users">) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  // Handle adding a user to route results to
  const handleAddRouteUser = (user: SelectedUser) => {
    if (!routeToUserIds.includes(user.id)) {
      setRouteToUsers([...routeToUsers, user]);
    }
  };

  // Handle removing a user from route list
  const handleRemoveRouteUser = (userId: Id<"users">) => {
    setRouteToUsers(routeToUsers.filter((u) => u.id !== userId));
  };

  // Create share link
  const handleCreateLink = async () => {
    if (shareType === "internal" && selectedUsers.length === 0) {
      return; // Can't create internal link without recipients
    }

    // Default route to self if not specified
    const routeTo =
      routeToUsers.length > 0
        ? routeToUsers.map((u) => u.id)
        : currentUser?.id
        ? [currentUser.id]
        : [];

    if (routeTo.length === 0) {
      return; // Need at least one recipient
    }

    setIsCreating(true);
    try {
      await createLinkMutation({
        documentId,
        shareType,
        sharedWithUserIds:
          shareType === "internal" ? selectedUsers.map((u) => u.id) : undefined,
        routeResultsTo: routeTo,
        expiresAt: getExpirationTimestamp(expiration),
        maxUses: maxUses ? parseInt(maxUses, 10) : undefined,
      });

      // Reset form
      setSelectedUsers([]);
      setRouteToUsers([]);
      setExpiration("never");
      setMaxUses("");
      setShowAdvanced(false);
    } catch (error) {
      console.error("Failed to create share link:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Revoke share link
  const handleRevoke = async (token: string) => {
    setIsRevoking(token);
    try {
      await revokeLinkMutation({ token });
    } catch (error) {
      console.error("Failed to revoke share link:", error);
    } finally {
      setIsRevoking(null);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = async (token: string) => {
    const url = `${window.location.origin}/share/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  if (!isOpen) return null;

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
          maxWidth: "520px",
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
            Share: {documentTitle}
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

        {/* Create new link section */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid var(--color-border)",
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
            Create New Share Link
          </h3>

          {/* Share type */}
          <div style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--color-ink-light)",
                display: "block",
                marginBottom: "0.375rem",
              }}
            >
              Link Type
            </label>
            <Select
              options={shareTypeOptions}
              value={shareType}
              onChange={(val) => setShareType(val as ShareType)}
              inputSize="sm"
            />
          </div>

          {/* Internal only: Share with users */}
          {shareType === "internal" && (
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-ink-light)",
                  display: "block",
                  marginBottom: "0.375rem",
                }}
              >
                Share with
              </label>
              <UserPicker
                onSelect={handleAddShareUser}
                excludeIds={selectedUserIds}
                placeholder="Add staff members..."
              />
              {selectedUsers.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.375rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {selectedUsers.map((user) => (
                    <span
                      key={user.id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        padding: "0.25rem 0.5rem",
                        background: "var(--color-background)",
                        borderRadius: "2px",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        color: "var(--color-ink)",
                      }}
                    >
                      {user.displayName || user.name || user.email}
                      <button
                        onClick={() => handleRemoveShareUser(user.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "0",
                          color: "var(--color-ink-muted)",
                          display: "flex",
                          alignItems: "center",
                        }}
                        aria-label="Remove"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M3 3L9 9M9 3L3 9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Route results to */}
          <div style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--color-ink-light)",
                display: "block",
                marginBottom: "0.375rem",
              }}
            >
              Route results to
              <span
                style={{
                  fontWeight: 400,
                  color: "var(--color-ink-muted)",
                  marginLeft: "0.5rem",
                }}
              >
                (defaults to you)
              </span>
            </label>
            <UserPicker
              onSelect={handleAddRouteUser}
              excludeIds={routeToUserIds}
              placeholder="Add recipients..."
            />
            {routeToUsers.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.375rem",
                  marginTop: "0.5rem",
                }}
              >
                {routeToUsers.map((user) => (
                  <span
                    key={user.id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.25rem 0.5rem",
                      background: "var(--color-background)",
                      borderRadius: "2px",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "var(--color-ink)",
                    }}
                  >
                    {user.displayName || user.name || user.email}
                    <button
                      onClick={() => handleRemoveRouteUser(user.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "0",
                        color: "var(--color-ink-muted)",
                        display: "flex",
                        alignItems: "center",
                      }}
                      aria-label="Remove"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M3 3L9 9M9 3L3 9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Advanced options toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem 0",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--color-ink-light)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              marginBottom: showAdvanced ? "0.75rem" : 0,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 180ms ease-out",
              }}
            >
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Advanced options
          </button>

          {/* Advanced options */}
          {showAdvanced && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                marginBottom: "0.75rem",
              }}
            >
              <div>
                <label
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--color-ink-light)",
                    display: "block",
                    marginBottom: "0.375rem",
                  }}
                >
                  Expires
                </label>
                <Select
                  options={expirationOptions}
                  value={expiration}
                  onChange={(val) => setExpiration(val as ExpirationOption)}
                  inputSize="sm"
                />
              </div>
              <div>
                <label
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--color-ink-light)",
                    display: "block",
                    marginBottom: "0.375rem",
                  }}
                >
                  Max uses
                </label>
                <input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Unlimited"
                  min="1"
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--color-ink)",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          )}

          {/* Create button */}
          <button
            onClick={handleCreateLink}
            disabled={
              isCreating ||
              (shareType === "internal" && selectedUsers.length === 0)
            }
            style={{
              width: "100%",
              padding: "0.625rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-surface)",
              background:
                isCreating ||
                (shareType === "internal" && selectedUsers.length === 0)
                  ? "var(--color-ink-muted)"
                  : "var(--color-accent)",
              border: "none",
              borderRadius: "2px",
              cursor:
                isCreating ||
                (shareType === "internal" && selectedUsers.length === 0)
                  ? "not-allowed"
                  : "pointer",
              opacity: isCreating ? 0.7 : 1,
            }}
          >
            {isCreating ? "Creating..." : "Create Link"}
          </button>
        </div>

        {/* Existing links section */}
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
            Existing Links
          </h3>

          {(existingLinks ?? []).length === 0 ? (
            <div
              style={{
                padding: "1rem 0",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "var(--color-ink-muted)",
                textAlign: "center",
              }}
            >
              No share links created yet
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {(existingLinks ?? []).map((link) => (
                <div
                  key={link._id}
                  style={{
                    padding: "0.75rem",
                    background: "var(--color-background)",
                    borderRadius: "2px",
                    border: `1px solid ${link.isActive ? "var(--color-border)" : "var(--color-error)"}`,
                    opacity: link.isActive ? 1 : 0.7,
                  }}
                >
                  {/* Link info row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          color:
                            link.shareType === "internal"
                              ? "var(--color-accent)"
                              : "var(--color-ink-light)",
                          padding: "0.125rem 0.375rem",
                          background:
                            link.shareType === "internal"
                              ? "rgba(163, 133, 86, 0.1)"
                              : "var(--color-surface)",
                          borderRadius: "2px",
                          textTransform: "capitalize",
                        }}
                      >
                        {link.shareType}
                      </span>
                      {link.sharedWithUsers && link.sharedWithUsers.length > 0 && (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.75rem",
                            color: "var(--color-ink-muted)",
                          }}
                        >
                          {link.sharedWithUsers.length} user
                          {link.sharedWithUsers.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.75rem",
                          color: "var(--color-ink-muted)",
                        }}
                      >
                        {formatRelativeTime(link.createdAt)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      {link.useCount > 0 && (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.75rem",
                            color: "var(--color-ink-muted)",
                            marginRight: "0.5rem",
                          }}
                        >
                          {link.useCount} use{link.useCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status row */}
                  {!link.isActive && (
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        color: "var(--color-error)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {link.isExpired && "Expired"}
                      {link.isUsageExceeded && "Usage limit reached"}
                    </div>
                  )}

                  {/* Expiration/limits info */}
                  {(link.expiresAt || link.maxUses) && link.isActive && (
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        color: "var(--color-ink-muted)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {link.expiresAt && `Expires ${formatDate(link.expiresAt)}`}
                      {link.expiresAt && link.maxUses && " | "}
                      {link.maxUses &&
                        `${link.maxUses - link.useCount} of ${link.maxUses} uses remaining`}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      onClick={() => handleCopyLink(link.token)}
                      disabled={!link.isActive}
                      style={{
                        flex: 1,
                        padding: "0.375rem 0.75rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: link.isActive ? "var(--color-ink)" : "var(--color-ink-muted)",
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "2px",
                        cursor: link.isActive ? "pointer" : "not-allowed",
                      }}
                    >
                      {copiedToken === link.token ? "Copied!" : "Copy Link"}
                    </button>
                    <button
                      onClick={() => handleRevoke(link.token)}
                      disabled={isRevoking === link.token}
                      style={{
                        padding: "0.375rem 0.75rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "var(--color-error)",
                        background: "transparent",
                        border: "1px solid var(--color-error)",
                        borderRadius: "2px",
                        cursor: "pointer",
                        opacity: isRevoking === link.token ? 0.5 : 1,
                      }}
                    >
                      {isRevoking === link.token ? "..." : "Revoke"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
