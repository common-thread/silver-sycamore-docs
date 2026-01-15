"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { UserSearchInput } from "./UserSearchInput";

interface StartDMDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StartDMDialog({ isOpen, onClose }: StartDMDialogProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findOrCreateDM = useMutation(api.channels.findOrCreateDM);

  const handleSelectUser = async (userId: Id<"users">) => {
    setIsCreating(true);
    setError(null);

    try {
      const result = await findOrCreateDM({ otherUserId: userId });
      router.push(`/messages/${result.channelId}`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create conversation");
      setIsCreating(false);
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--color-surface)",
          width: "100%",
          maxWidth: "480px",
          border: "1px solid var(--color-border)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
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
            New Direct Message
          </h2>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              padding: 0,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--color-ink-muted)",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-ink-muted)";
            }}
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

        {/* Content */}
        <div style={{ padding: "1.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ink-muted)",
              margin: 0,
              marginBottom: "1rem",
            }}
          >
            Search for a team member to start a direct message conversation.
          </p>

          {/* User search */}
          <UserSearchInput
            onSelect={handleSelectUser}
            placeholder="Search by name or email..."
            autoFocus
          />

          {/* Error message */}
          {error && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem",
                background: "rgba(220, 38, 38, 0.1)",
                border: "1px solid rgba(220, 38, 38, 0.2)",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "#DC2626",
              }}
            >
              {error}
            </div>
          )}

          {/* Loading state */}
          {isCreating && (
            <div
              style={{
                marginTop: "1rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--color-ink-muted)",
                textAlign: "center",
              }}
            >
              Opening conversation...
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "1rem 1.5rem",
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-surface-dim, #F8F8F6)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--color-ink)",
              background: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: 0,
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-ink-light)";
              e.currentTarget.style.background = "var(--color-surface)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
