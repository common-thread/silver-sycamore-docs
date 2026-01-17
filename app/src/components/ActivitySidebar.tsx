"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface ActivitySidebarProps {
  limit?: number; // Default 5
}

/**
 * Format timestamp as relative time (e.g., "2h ago", "Yesterday")
 */
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

  // Return formatted date for older activity
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Get icon character for activity type
 */
function getActivityIcon(
  type:
    | "procedure_started"
    | "procedure_completed"
    | "checklist_completed"
    | "form_submitted"
    | "form_received"
): string {
  switch (type) {
    case "procedure_started":
      return "\u2610"; // Empty checkbox
    case "procedure_completed":
      return "\u2713"; // Checkmark
    case "checklist_completed":
      return "\u2713"; // Checkmark
    case "form_submitted":
      return "\u2191"; // Up arrow
    case "form_received":
      return "\u2193"; // Down arrow
    default:
      return "\u2022"; // Bullet
  }
}

/**
 * Get action label for activity type
 */
function getActivityLabel(
  type:
    | "procedure_started"
    | "procedure_completed"
    | "checklist_completed"
    | "form_submitted"
    | "form_received"
): string {
  switch (type) {
    case "procedure_started":
      return "Started";
    case "procedure_completed":
      return "Completed";
    case "checklist_completed":
      return "Completed";
    case "form_submitted":
      return "Submitted";
    case "form_received":
      return "Received";
    default:
      return "";
  }
}

/**
 * Get link for activity item based on type and IDs
 */
function getActivityLink(activity: {
  type: string;
  instanceId?: Id<"dynamicContentInstances">;
  documentId?: Id<"documents">;
  formSubmissionId?: Id<"formSubmissions">;
}): string | null {
  // For forms, link to submission if available
  if (activity.formSubmissionId) {
    return `/forms/submissions/${activity.formSubmissionId}`;
  }

  // For procedures/checklists with document, link to document
  if (activity.documentId) {
    return `/documents/${activity.documentId}`;
  }

  // For dynamic instances
  if (activity.instanceId) {
    return `/workspace/activity/${activity.instanceId}`;
  }

  return null;
}

export function ActivitySidebar({ limit = 5 }: ActivitySidebarProps) {
  const activity = useQuery(api.activity.getRecentActivity, { limit });

  const isLoading = activity === undefined;

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "0",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "0.75rem 1rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--color-ink)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          My Activity
        </h3>
      </div>

      {/* Activity List */}
      <div style={{ padding: "0.5rem 0" }}>
        {isLoading ? (
          <div
            style={{
              padding: "1.5rem 1rem",
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--color-ink-muted)",
            }}
          >
            Loading...
          </div>
        ) : activity.length === 0 ? (
          <div
            style={{
              padding: "1.5rem 1rem",
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--color-ink-muted)",
            }}
          >
            No recent activity
          </div>
        ) : (
          activity.map((item) => {
            const link = getActivityLink(item);
            const content = (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  padding: "0.625rem 1rem",
                  cursor: link ? "pointer" : "default",
                  transition: "background 150ms ease",
                }}
                onMouseEnter={(e) => {
                  if (link) {
                    e.currentTarget.style.background = "var(--color-surface-dim)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Icon */}
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    color:
                      item.type === "procedure_completed" ||
                      item.type === "checklist_completed"
                        ? "var(--color-success, #4A7C59)"
                        : "var(--color-ink-muted)",
                    lineHeight: 1,
                    flexShrink: 0,
                    width: "1.25rem",
                    textAlign: "center",
                  }}
                >
                  {getActivityIcon(item.type)}
                </span>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-ink)",
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ color: "var(--color-ink-muted)" }}>
                      {getActivityLabel(item.type)}:
                    </span>{" "}
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "inline",
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-ink-light)",
                      marginTop: "2px",
                    }}
                  >
                    {formatTimeAgo(item.createdAt)}
                  </div>
                </div>
              </div>
            );

            return link ? (
              <Link
                key={item._id}
                href={link}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                {content}
              </Link>
            ) : (
              <div key={item._id}>{content}</div>
            );
          })
        )}
      </div>

      {/* Footer - View All link */}
      <div
        style={{
          padding: "0.625rem 1rem",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/activity"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            color: "var(--color-accent)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          View All Activity
          <span style={{ fontSize: "var(--text-xs)" }}>{"\u2192"}</span>
        </Link>
      </div>
    </div>
  );
}
