"use client";

import { useState, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface Author {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

interface Message {
  _id: Id<"messages">;
  channelId: Id<"channels">;
  content: string;
  createdAt: number;
  updatedAt: number;
  isEdited: boolean;
  parentId?: Id<"messages">;
  author: Author;
}

interface MessageItemProps {
  message: Message;
  currentUserId?: string;
  userRole?: string;
  membershipRole?: string;
  onReply?: (messageId: Id<"messages">) => void;
  mentionedUsersMap?: Map<string, string>;
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return timeStr;
  }

  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${dateStr}, ${timeStr}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Parse @[userId] patterns from content
type ContentPart = string | { type: "mention"; userId: string };

function parseMentions(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const mentionRegex = /@\[([^\]]+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    parts.push({ type: "mention", userId: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts;
}

// Extract all user IDs from content for batch lookup
export function extractMentionIds(content: string): string[] {
  const mentionRegex = /@\[([^\]]+)\]/g;
  const ids: string[] = [];
  let match;
  while ((match = mentionRegex.exec(content)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

export function MessageItem({
  message,
  currentUserId,
  userRole,
  membershipRole,
  onReply,
  mentionedUsersMap,
}: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const editMessage = useMutation(api.messages.editMessage);
  const deleteMessage = useMutation(api.messages.deleteMessage);

  // Get thread reply count
  const threadReplies = useQuery(api.messages.getThreadMessages, {
    parentId: message._id,
  });
  const replyCount = threadReplies?.length ?? 0;

  // Build mention map from prop or empty
  const userDisplayMap = useMemo(() => {
    return mentionedUsersMap ?? new Map<string, string>();
  }, [mentionedUsersMap]);

  // Render content with mentions highlighted
  const renderContent = (content: string) => {
    const parts = parseMentions(content);
    return parts.map((part, index) => {
      if (typeof part === "string") {
        return <span key={index}>{part}</span>;
      }
      const displayName = userDisplayMap.get(part.userId) || "Unknown User";
      return (
        <span
          key={index}
          style={{
            background: "var(--color-accent-light, #F5F0E8)",
            color: "var(--color-accent)",
            padding: "0 0.25rem",
            borderRadius: "2px",
            fontWeight: 500,
          }}
        >
          @{displayName}
        </span>
      );
    });
  };

  const isAuthor = currentUserId === message.author.id;
  const isChannelAdmin = membershipRole === "owner" || membershipRole === "admin";
  const canEdit = isAuthor;
  const canDelete = isAuthor || isChannelAdmin;

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    setIsUpdating(true);
    try {
      await editMessage({
        messageId: message._id,
        content: editContent,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to edit message:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setIsDeleting(true);
    try {
      await deleteMessage({ messageId: message._id });
    } catch (error) {
      console.error("Failed to delete message:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        gap: "0.75rem",
        padding: "0.5rem 1rem",
        background: isHovered ? "var(--color-surface-dim, #F8F8F6)" : "transparent",
        transition: "background 0.1s ease",
      }}
    >
      {/* Avatar */}
      {message.author.avatarUrl ? (
        <img
          src={message.author.avatarUrl}
          alt={message.author.displayName}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "4px",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "4px",
            background: "var(--color-accent-light, #F5F0E8)",
            color: "var(--color-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {getInitials(message.author.displayName)}
        </div>
      )}

      {/* Content area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Author + timestamp row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.5rem",
            marginBottom: "0.125rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "var(--color-ink)",
            }}
          >
            {message.author.displayName}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--color-ink-muted)",
            }}
          >
            {formatTimestamp(message.createdAt)}
            {message.isEdited && " (edited)"}
          </span>
        </div>

        {/* Message body */}
        {isEditing ? (
          <div style={{ marginTop: "0.25rem" }}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{
                width: "100%",
                minHeight: "4rem",
                padding: "0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                color: "var(--color-ink)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
                resize: "vertical",
                lineHeight: 1.5,
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              <button
                onClick={handleEdit}
                disabled={isUpdating || !editContent.trim()}
                style={{
                  padding: "0.375rem 0.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-surface)",
                  background: "var(--color-accent)",
                  border: "none",
                  borderRadius: "2px",
                  cursor: isUpdating ? "not-allowed" : "pointer",
                  opacity: isUpdating || !editContent.trim() ? 0.6 : 1,
                }}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(message.content);
                }}
                disabled={isUpdating}
                style={{
                  padding: "0.375rem 0.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-ink-light)",
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              color: "var(--color-ink)",
              lineHeight: 1.5,
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {renderContent(message.content)}
          </p>
        )}

        {/* Thread reply indicator */}
        {replyCount > 0 && !isEditing && (
          <button
            onClick={() => onReply?.(message._id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              marginTop: "0.375rem",
              padding: "0.25rem 0.5rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--color-accent)",
              background: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 4C2 3.44772 2.44772 3 3 3H11C11.5523 3 12 3.44772 12 4V9C12 9.55228 11.5523 10 11 10H7.5L5 12V10H3C2.44772 10 2 9.55228 2 9V4Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </button>
        )}
      </div>

      {/* Hover actions */}
      {isHovered && !isEditing && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.25rem",
            flexShrink: 0,
          }}
        >
          {onReply && (
            <button
              onClick={() => onReply(message._id)}
              title="Reply in thread"
              style={{
                padding: "0.375rem",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 5C3 4.44772 3.44772 4 4 4H12C12.5523 4 13 4.44772 13 5V10C13 10.5523 12.5523 11 12 11H8L5 13V11H4C3.44772 11 3 10.5523 3 10V5Z"
                  stroke="var(--color-ink-muted)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              title="Edit"
              style={{
                padding: "0.375rem",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z"
                  stroke="var(--color-ink-muted)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete"
              style={{
                padding: "0.375rem",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
                cursor: isDeleting ? "not-allowed" : "pointer",
                opacity: isDeleting ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 5H13M6 5V4C6 3.44772 6.44772 3 7 3H9C9.55228 3 10 3.44772 10 4V5M7 8V11M9 8V11M4 5L5 13H11L12 5"
                  stroke="var(--color-ink-muted)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
