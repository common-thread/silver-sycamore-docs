"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { UserPicker } from "../UserPicker";
import Select from "@/components/ui/Select";
import { useShareLinkForm, ShareType, ExpirationOption } from "./hooks/useShareLinkForm";
import { UserChipList } from "./UserChipList";
import { ShareLinkItem } from "./ShareLinkItem";

interface ShareLinkDialogProps {
  documentId: Id<"documents">;
  documentTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

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

export function ShareLinkDialog({
  documentId,
  documentTitle,
  isOpen,
  onClose,
}: ShareLinkDialogProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Form state and handlers
  const form = useShareLinkForm(documentId);

  // Queries and mutations
  const existingLinks = useQuery(api.sharing.getDocumentShareLinks, { documentId });
  const revokeLinkMutation = useMutation(api.sharing.revokeShareLink);

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

  // Revoke link
  const handleRevoke = async (token: string) => {
    try {
      await revokeLinkMutation({ token });
    } catch (error) {
      console.error("Failed to revoke share link:", error);
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
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-dialog-title"
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
            id="share-dialog-title"
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
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
              value={form.shareType}
              onChange={(val) => form.setShareType(val as ShareType)}
              inputSize="sm"
            />
          </div>

          {/* Internal only: Share with users */}
          {form.shareType === "internal" && (
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
                onSelect={form.addShareUser}
                excludeIds={form.selectedUserIds}
                placeholder="Add staff members..."
              />
              <UserChipList users={form.selectedUsers} onRemove={form.removeShareUser} />
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
              onSelect={form.addRouteUser}
              excludeIds={form.routeToUserIds}
              placeholder="Add recipients..."
            />
            <UserChipList users={form.routeToUsers} onRemove={form.removeRouteUser} />
          </div>

          {/* Advanced options toggle */}
          <button
            onClick={() => form.setShowAdvanced(!form.showAdvanced)}
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
              marginBottom: form.showAdvanced ? "0.75rem" : 0,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                transform: form.showAdvanced ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 180ms ease-out",
              }}
              aria-hidden="true"
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
          {form.showAdvanced && (
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
                  value={form.expiration}
                  onChange={(val) => form.setExpiration(val as ExpirationOption)}
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
                  value={form.maxUses}
                  onChange={(e) => form.setMaxUses(e.target.value)}
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
            onClick={form.createLink}
            disabled={!form.canCreate}
            style={{
              width: "100%",
              padding: "0.625rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-surface)",
              background: form.canCreate
                ? "var(--color-accent)"
                : "var(--color-ink-muted)",
              border: "none",
              borderRadius: "2px",
              cursor: form.canCreate ? "pointer" : "not-allowed",
              opacity: form.isCreating ? 0.7 : 1,
            }}
          >
            {form.isCreating ? "Creating..." : "Create Link"}
          </button>
        </div>

        {/* Existing links section */}
        <div style={{ padding: "1rem", flex: 1, overflowY: "auto" }}>
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
                <ShareLinkItem
                  key={link._id}
                  link={link}
                  onCopy={handleCopyLink}
                  onRevoke={handleRevoke}
                  copiedToken={copiedToken}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShareLinkDialog;
