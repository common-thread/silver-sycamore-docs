"use client";

import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface NotificationInboxProps {
  onClose: () => void;
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  // Return formatted date for older notifications
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function NotificationInbox({ onClose }: NotificationInboxProps) {
  const router = useRouter();
  const result = useQuery(api.notifications.listNotifications, { limit: 10 });
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  const notifications = result?.notifications ?? [];
  const isLoading = result === undefined;

  const handleNotificationClick = async (notification: {
    _id: Id<"notifications">;
    channelId: Id<"channels">;
    messageId: Id<"messages">;
    isRead: boolean;
  }) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await markAsRead({ notificationId: notification._id });
    }

    // Navigate to the channel/message
    router.push(`/messages/${notification.channelId}`);
    onClose();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead({});
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div
      style={{
        width: "360px",
        maxHeight: "480px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "8px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--color-ink)",
          }}
        >
          Notifications
        </h3>
        {hasUnread && (
          <button
            onClick={handleMarkAllAsRead}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--color-accent)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-surface-dim)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {isLoading ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--color-ink-muted)",
            }}
          >
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--color-ink-muted)",
            }}
          >
            <div style={{ marginBottom: "0.5rem" }}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                style={{ opacity: 0.4 }}
              >
                <path
                  d="M20 4C13.3726 4 8 9.37258 8 16V22C8 24.2091 6.20914 26 4 26V28H36V26C33.7909 26 32 24.2091 32 22V16C32 9.37258 26.6274 4 20 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 28V30C15 32.7614 17.2386 35 20 35C22.7614 35 25 32.7614 25 30V28"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                width: "100%",
                padding: "0.875rem 1rem",
                fontFamily: "var(--font-body)",
                textAlign: "left",
                background: notification.isRead
                  ? "transparent"
                  : "var(--color-surface-dim)",
                border: "none",
                borderBottom: "1px solid var(--color-border)",
                cursor: "pointer",
                transition: "background 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-surface-dim)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = notification.isRead
                  ? "transparent"
                  : "var(--color-surface-dim)";
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-surface)",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {notification.fromUser.displayName.charAt(0)}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-ink)",
                    lineHeight: 1.4,
                  }}
                >
                  <strong>{notification.fromUser.displayName}</strong>{" "}
                  {notification.type === "mention"
                    ? "mentioned you in"
                    : "sent you a message in"}{" "}
                  <span style={{ color: "var(--color-accent)" }}>
                    {notification.channel.type === "dm"
                      ? "a direct message"
                      : `#${notification.channel.name}`}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--color-ink-muted)",
                    marginTop: "2px",
                  }}
                >
                  {formatTimeAgo(notification.createdAt)}
                </div>
              </div>

              {/* Unread indicator */}
              {!notification.isRead && (
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--color-accent)",
                    flexShrink: 0,
                    marginTop: "6px",
                  }}
                />
              )}
            </button>
          ))
        )}
      </div>

      {/* Footer - See all link */}
      {notifications.length > 0 && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderTop: "1px solid var(--color-border)",
            textAlign: "center",
          }}
        >
          <button
            onClick={() => {
              router.push("/messages");
              onClose();
            }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--color-accent)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            Go to Messages
          </button>
        </div>
      )}
    </div>
  );
}
