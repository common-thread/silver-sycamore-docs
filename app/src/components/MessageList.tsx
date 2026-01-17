"use client";

import { useEffect, useRef, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { MessageItem, extractMentionIds } from "./MessageItem";

interface MessageListProps {
  channelId: Id<"channels">;
  currentUserId?: string;
  userRole?: string;
  membershipRole?: string;
  onReply?: (messageId: Id<"messages">) => void;
}

interface Message {
  _id: Id<"messages">;
  channelId: Id<"channels">;
  content: string;
  createdAt: number;
  updatedAt: number;
  isEdited: boolean;
  parentId?: Id<"messages">;
  author: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
}

function formatDateDivider(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  return date1.toDateString() === date2.toDateString();
}

export function MessageList({
  channelId,
  currentUserId,
  userRole,
  membershipRole,
  onReply,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);

  // Fetch messages with real-time updates (top-level messages only)
  const result = useQuery(api.messages.listMessages, { channelId, limit: 50 });
  const messages = result?.messages ?? [];

  // Filter to only top-level messages (no parentId) and reverse to show oldest first
  const topLevelMessages = useMemo(() => {
    return messages
      .filter((m: Message) => !m.parentId)
      .reverse();
  }, [messages]);

  // Extract all mention IDs from all messages for batch lookup
  const allMentionIds = useMemo(() => {
    const ids = new Set<string>();
    topLevelMessages.forEach((m: Message) => {
      extractMentionIds(m.content).forEach((id) => ids.add(id));
    });
    return Array.from(ids);
  }, [topLevelMessages]);

  // Batch lookup mentioned users
  const mentionedUsers = useQuery(
    api.users.getUsersById,
    allMentionIds.length > 0
      ? { userIds: allMentionIds as Id<"users">[] }
      : "skip"
  );

  // Create lookup map for display names
  const userDisplayMap = useMemo(() => {
    const map = new Map<string, string>();
    mentionedUsers?.forEach((user) => {
      map.set(user.id, user.displayName || user.name || user.email || "Unknown User");
    });
    return map;
  }, [mentionedUsers]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (topLevelMessages.length > prevMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCountRef.current = topLevelMessages.length;
  }, [topLevelMessages.length]);

  // Initial scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [channelId]);

  // Loading state
  if (result === undefined) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          color: "var(--color-ink-muted)",
        }}
      >
        Loading messages...
      </div>
    );
  }

  // Empty state
  if (topLevelMessages.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-8)",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div
            style={{
              width: "var(--space-12)",
              height: "var(--space-12)",
              margin: "0 auto var(--space-4)",
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
              fontSize: "var(--text-sm)",
              color: "var(--color-ink-muted)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            No messages yet. Start the conversation!
          </p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const messagesWithDividers: Array<{ type: "divider"; date: string } | { type: "message"; message: Message }> = [];
  let lastDate: string | null = null;

  topLevelMessages.forEach((message: Message) => {
    const messageDate = formatDateDivider(message.createdAt);
    if (messageDate !== lastDate) {
      messagesWithDividers.push({ type: "divider", date: messageDate });
      lastDate = messageDate;
    }
    messagesWithDividers.push({ type: "message", message });
  });

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1 }} /> {/* Spacer to push messages to bottom */}
      <div>
        {messagesWithDividers.map((item, index) => {
          if (item.type === "divider") {
            return (
              <div
                key={`divider-${item.date}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "var(--space-4) var(--space-6)",
                  gap: "var(--space-4)",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "var(--color-border)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-medium)",
                    color: "var(--color-ink-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "var(--tracking-wide)",
                  }}
                >
                  {item.date}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "var(--color-border)",
                  }}
                />
              </div>
            );
          }

          return (
            <MessageItem
              key={item.message._id}
              message={item.message}
              currentUserId={currentUserId}
              userRole={userRole}
              membershipRole={membershipRole}
              onReply={onReply}
              mentionedUsersMap={userDisplayMap}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
