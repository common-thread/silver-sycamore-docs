"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { MessageList } from "../../../components/MessageList";
import { MessageInput } from "../../../components/MessageInput";

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.channelId as Id<"channels">;

  const channel = useQuery(api.channels.getChannel, { channelId });
  const members = useQuery(api.channels.getChannelMembers, { channelId });
  const currentUser = useQuery(api.users.getCurrentUser);
  const updateLastRead = useMutation(api.channels.updateLastRead);

  // Mark channel as read when viewing
  useEffect(() => {
    if (channel && channelId) {
      updateLastRead({ channelId }).catch(console.error);
    }
  }, [channel, channelId, updateLastRead]);

  // Loading state
  if (channel === undefined || members === undefined || currentUser === undefined) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
          fontSize: "0.9375rem",
          color: "var(--color-ink-muted)",
        }}
      >
        Loading channel...
      </div>
    );
  }

  // Channel not found or no access
  if (channel === null) {
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
            <circle
              cx="16"
              cy="16"
              r="12"
              stroke="var(--color-ink-muted)"
              strokeWidth="1.5"
            />
            <path
              d="M12 12L20 20M20 12L12 20"
              stroke="var(--color-ink-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--color-ink)",
            margin: 0,
            marginBottom: "0.5rem",
          }}
        >
          Channel not found
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9375rem",
            color: "var(--color-ink-muted)",
            margin: 0,
          }}
        >
          This channel may not exist or you may not have access to it.
        </p>
      </div>
    );
  }

  const memberCount = members?.length ?? 0;
  const membershipRole = channel.membership?.role;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Channel header */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Channel icon */}
          {channel.type === "dm" ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="8"
                r="3.5"
                stroke="var(--color-ink-light)"
                strokeWidth="1.2"
              />
              <path
                d="M4 18C4 14 6 12 10 12C14 12 16 14 16 18"
                stroke="var(--color-ink-light)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          ) : channel.type === "private" ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect
                x="4"
                y="9"
                width="12"
                height="8"
                rx="1"
                stroke="var(--color-ink-light)"
                strokeWidth="1.2"
              />
              <path
                d="M6 9V7C6 4.79086 7.79086 3 10 3C12.2091 3 14 4.79086 14 7V9"
                stroke="var(--color-ink-light)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 500,
                color: "var(--color-ink-light)",
                lineHeight: 1,
              }}
            >
              #
            </span>
          )}

          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                margin: 0,
              }}
            >
              {channel.name}
            </h1>
            {channel.description && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  color: "var(--color-ink-muted)",
                  margin: 0,
                  marginTop: "0.25rem",
                }}
              >
                {channel.description}
              </p>
            )}
          </div>

          {/* Member count */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--color-ink-muted)",
              cursor: "pointer",
            }}
            title="View members"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6" cy="5" r="2" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M2 13C2 10.5 3.5 9 6 9C8.5 9 10 10.5 10 13"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="11" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M14 12C14 10.3 13 9.5 11 9.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </div>

          {/* Settings gear placeholder */}
          <button
            title="Channel settings"
            style={{
              padding: "0.375rem",
              background: "transparent",
              border: "1px solid transparent",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s ease, border-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-surface-dim, #F8F8F6)";
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M7.5 2.25H10.5L11.25 4.5L13.5 5.25L15.75 4.5V7.5L14.25 9L15.75 10.5V13.5L13.5 12.75L11.25 13.5L10.5 15.75H7.5L6.75 13.5L4.5 12.75L2.25 13.5V10.5L3.75 9L2.25 7.5V4.5L4.5 5.25L6.75 4.5L7.5 2.25Z"
                stroke="var(--color-ink-muted)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="9"
                cy="9"
                r="2.25"
                stroke="var(--color-ink-muted)"
                strokeWidth="1.2"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Message list */}
      <MessageList
        channelId={channelId}
        currentUserId={currentUser?.id}
        userRole={currentUser?.profile?.role}
        membershipRole={membershipRole}
      />

      {/* Message input */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          flexShrink: 0,
        }}
      >
        <MessageInput channelId={channelId} channelName={channel.name} />
      </div>
    </div>
  );
}
