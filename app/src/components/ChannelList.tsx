"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { StartDMDialog } from "./StartDMDialog";

interface ChannelListProps {
  currentChannelId?: string;
}

export function ChannelList({ currentChannelId }: ChannelListProps) {
  const [isDMDialogOpen, setIsDMDialogOpen] = useState(false);
  const channels = useQuery(api.channels.listUserChannels);

  if (channels === undefined) {
    return (
      <div
        style={{
          padding: "1rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          color: "var(--color-ink-muted)",
        }}
      >
        Loading channels...
      </div>
    );
  }

  // Group channels by type
  const groupedChannels = channels.reduce(
    (acc, channel) => {
      if (channel.type === "dm") {
        acc.dms.push(channel);
      } else {
        acc.channels.push(channel);
      }
      return acc;
    },
    { channels: [] as typeof channels, dms: [] as typeof channels }
  );

  const hasChannels = groupedChannels.channels.length > 0;
  const hasDMs = groupedChannels.dms.length > 0;

  return (
    <div style={{ padding: "0.5rem 0" }}>
      {/* Channels section */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            padding: "0.5rem 1rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--color-ink-muted)",
          }}
        >
          Channels
        </div>

        {hasChannels ? (
          groupedChannels.channels.map((channel) => (
            <ChannelItem
              key={channel._id}
              channel={channel}
              isActive={currentChannelId === channel._id}
            />
          ))
        ) : (
          <div
            style={{
              padding: "0.5rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--color-ink-muted)",
              fontStyle: "italic",
            }}
          >
            No channels yet.{" "}
            <span style={{ color: "var(--color-accent)", cursor: "pointer" }}>
              Create one
            </span>
          </div>
        )}
      </div>

      {/* Direct Messages section */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem 1rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-ink-muted)",
            }}
          >
            Direct Messages
          </span>
          <button
            onClick={() => setIsDMDialogOpen(true)}
            title="Start a direct message"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "20px",
              height: "20px",
              padding: 0,
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              fontWeight: 400,
              color: "var(--color-ink-muted)",
              background: "transparent",
              border: "none",
              borderRadius: 0,
              cursor: "pointer",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-ink-muted)";
            }}
          >
            +
          </button>
        </div>

        {hasDMs ? (
          groupedChannels.dms.map((channel) => (
            <ChannelItem
              key={channel._id}
              channel={channel}
              isActive={currentChannelId === channel._id}
            />
          ))
        ) : (
          <div
            style={{
              padding: "0.5rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--color-ink-muted)",
              fontStyle: "italic",
            }}
          >
            No direct messages.{" "}
            <span
              style={{ color: "var(--color-accent)", cursor: "pointer" }}
              onClick={() => setIsDMDialogOpen(true)}
            >
              Start a conversation
            </span>
          </div>
        )}
      </div>

      {/* Start DM dialog */}
      <StartDMDialog
        isOpen={isDMDialogOpen}
        onClose={() => setIsDMDialogOpen(false)}
      />
    </div>
  );
}

interface ChannelItemProps {
  channel: {
    _id: string;
    name: string;
    type: string;
    description?: string;
    dmPartner?: {
      id: string;
      email?: string;
      name?: string;
      displayName?: string;
      avatarUrl?: string;
    } | null;
    membership: {
      lastReadAt?: number;
    };
  };
  isActive: boolean;
}

function ChannelItem({ channel, isActive }: ChannelItemProps) {
  // Get unread count for this channel
  const unreadCount = useQuery(api.messages.getUnreadCount, {
    channelId: channel._id as any,
  });

  const hasUnread = unreadCount !== undefined && unreadCount > 0;

  // For DMs, display the partner's name; otherwise use channel name
  const displayName =
    channel.type === "dm" && channel.dmPartner
      ? channel.dmPartner.displayName ||
        channel.dmPartner.name ||
        channel.dmPartner.email ||
        "Unknown User"
      : channel.name;

  // For DMs, get the partner's initial for avatar
  const dmInitial =
    channel.type === "dm" && channel.dmPartner
      ? (
          channel.dmPartner.displayName ||
          channel.dmPartner.name ||
          channel.dmPartner.email ||
          "?"
        ).charAt(0)
      : "";

  return (
    <Link
      href={`/messages/${channel._id}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        fontFamily: "var(--font-body)",
        fontSize: "0.875rem",
        fontWeight: isActive ? 600 : hasUnread ? 600 : 400,
        color: isActive
          ? "var(--color-accent)"
          : hasUnread
            ? "var(--color-ink)"
            : "var(--color-ink-light)",
        textDecoration: "none",
        background: isActive ? "var(--color-surface)" : "transparent",
        transition: "all 150ms ease",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "var(--color-surface)";
          e.currentTarget.style.color = "var(--color-ink)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = hasUnread
            ? "var(--color-ink)"
            : "var(--color-ink-light)";
        }
      }}
    >
      {/* Channel/DM icon */}
      {channel.type === "dm" ? (
        // DM: Show avatar circle with initial
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "var(--color-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: "var(--color-surface)",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          {dmInitial}
        </div>
      ) : channel.type === "private" ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <rect
            x="3"
            y="7"
            width="10"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M5 7V5C5 3.34315 6.34315 2 8 2C9.65685 2 11 3.34315 11 5V7"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            color: "currentColor",
            lineHeight: 1,
          }}
        >
          #
        </span>
      )}

      {/* Channel/DM name */}
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
        {displayName}
      </span>

      {/* Unread indicator */}
      {hasUnread && (
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--color-accent)",
            flexShrink: 0,
          }}
        />
      )}
    </Link>
  );
}
