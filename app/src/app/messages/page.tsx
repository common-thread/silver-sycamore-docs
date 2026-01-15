"use client";

import { useState } from "react";
import { CreateChannelDialog } from "@/components/CreateChannelDialog";

export default function MessagesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem",
        textAlign: "center",
      }}
    >
      {/* Welcome icon */}
      <div
        style={{
          width: "64px",
          height: "64px",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-surface-dim, #F8F8F6)",
          border: "1px solid var(--color-border)",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M6 10C6 8.89543 6.89543 8 8 8H24C25.1046 8 26 8.89543 26 10V20C26 21.1046 25.1046 22 24 22H18L12 26V22H8C6.89543 22 6 21.1046 6 20V10Z"
            stroke="var(--color-ink-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 13H21"
            stroke="var(--color-ink-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M11 17H17"
            stroke="var(--color-ink-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "var(--color-ink)",
          margin: 0,
          marginBottom: "0.75rem",
        }}
      >
        Select a channel to start messaging
      </h1>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.9375rem",
          color: "var(--color-ink-muted)",
          margin: 0,
          marginBottom: "2rem",
          maxWidth: "400px",
          lineHeight: 1.6,
        }}
      >
        Choose a channel from the sidebar to view messages, or create a new channel to get started.
      </p>

      {/* Quick actions */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.25rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--color-surface)",
            background: "var(--color-accent)",
            border: "none",
            borderRadius: 0,
            cursor: "pointer",
            transition: "all 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-accent-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-accent)";
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
          Create Channel
        </button>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.25rem",
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
            e.currentTarget.style.background = "var(--color-surface-dim, #F8F8F6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          Start DM
        </button>
      </div>

      {/* Create channel dialog */}
      <CreateChannelDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}
