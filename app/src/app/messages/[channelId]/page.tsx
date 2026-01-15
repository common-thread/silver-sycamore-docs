"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.channelId as Id<"channels">;

  const channel = useQuery(api.channels.getChannel, { channelId });
  const members = useQuery(api.channels.getChannelMembers, { channelId });

  // Loading state
  if (channel === undefined || members === undefined) {
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

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Channel header */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface)",
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
            }}
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
        </div>
      </div>

      {/* Message list placeholder */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "var(--color-background, #FAFAF8)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              margin: "0 auto 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V16C20 17.1046 19.1046 18 18 18H13L8 22V18H6C4.89543 18 4 17.1046 4 16V8Z"
                stroke="var(--color-ink-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              color: "var(--color-ink-muted)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Messages will appear here
          </p>
        </div>
      </div>

      {/* Message input placeholder */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-surface)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <input
            type="text"
            placeholder={`Message #${channel.name}`}
            disabled
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              color: "var(--color-ink-muted)",
              background: "var(--color-surface-dim, #F8F8F6)",
              border: "1px solid var(--color-border)",
              borderRadius: 0,
              outline: "none",
              cursor: "not-allowed",
            }}
          />
          <button
            disabled
            style={{
              padding: "0.75rem 1.25rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--color-surface)",
              background: "var(--color-ink-muted)",
              border: "none",
              borderRadius: 0,
              cursor: "not-allowed",
              opacity: 0.5,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
