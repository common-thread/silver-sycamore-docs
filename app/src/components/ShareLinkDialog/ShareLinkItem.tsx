"use client";

import { useState } from "react";

interface ShareLink {
  _id: string;
  token: string;
  shareType: string;
  sharedWithUsers?: Array<{ id: string; name?: string; email?: string }> | null;
  createdAt: number;
  expiresAt?: number;
  maxUses?: number;
  useCount: number;
  isActive: boolean;
  isExpired?: boolean;
  isUsageExceeded?: boolean;
}

interface ShareLinkItemProps {
  link: ShareLink;
  onCopy: (token: string) => Promise<void>;
  onRevoke: (token: string) => Promise<void>;
  copiedToken: string | null;
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

export function ShareLinkItem({ link, onCopy, onRevoke, copiedToken }: ShareLinkItemProps) {
  const [isRevoking, setIsRevoking] = useState(false);

  const handleRevoke = async () => {
    setIsRevoking(true);
    try {
      await onRevoke(link.token);
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
        {link.useCount > 0 && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--color-ink-muted)",
            }}
          >
            {link.useCount} use{link.useCount !== 1 ? "s" : ""}
          </span>
        )}
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
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => onCopy(link.token)}
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
          onClick={handleRevoke}
          disabled={isRevoking}
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
            opacity: isRevoking ? 0.5 : 1,
          }}
        >
          {isRevoking ? "..." : "Revoke"}
        </button>
      </div>
    </div>
  );
}
