"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ContentBox } from "./ContentBox";

type ActivityType =
  | "procedure_started"
  | "procedure_completed"
  | "checklist_completed"
  | "form_submitted"
  | "form_received";

type DateFilter = "all" | "week" | "month";

/**
 * Get icon character for activity type
 */
function getActivityIcon(type: ActivityType): string {
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
 * Get display label for activity type
 */
function getActivityTypeLabel(type: ActivityType): string {
  switch (type) {
    case "procedure_started":
      return "Started Procedure";
    case "procedure_completed":
      return "Completed Procedure";
    case "checklist_completed":
      return "Completed Checklist";
    case "form_submitted":
      return "Submitted Form";
    case "form_received":
      return "Form Received";
    default:
      return "Activity";
  }
}

/**
 * Format timestamp as full date and time
 */
function formatFullDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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

/**
 * Get date range timestamps for filter
 */
function getDateRange(filter: DateFilter): { dateFrom?: number; dateTo?: number } {
  if (filter === "all") {
    return {};
  }

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  if (filter === "week") {
    return { dateFrom: now - 7 * dayMs };
  }

  if (filter === "month") {
    return { dateFrom: now - 30 * dayMs };
  }

  return {};
}

const selectStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-sm)",
  color: "var(--color-ink)",
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "0",
  padding: "0.5rem 2rem 0.5rem 0.75rem",
  cursor: "pointer",
  appearance: "none" as const,
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M3 4.5L6 7.5L9 4.5'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.5rem center",
};

export function ActivityDashboard() {
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const dateRange = getDateRange(dateFilter);

  const result = useQuery(api.activity.getActivityDashboard, {
    type: typeFilter === "all" ? undefined : typeFilter,
    dateFrom: dateRange.dateFrom,
    dateTo: dateRange.dateTo,
    limit: 20,
    cursor,
  });

  const activity = result?.items ?? [];
  const nextCursor = result?.nextCursor;
  const isLoading = result === undefined;

  const handleLoadMore = () => {
    if (nextCursor) {
      setCursor(nextCursor);
    }
  };

  // Reset cursor when filters change
  const handleTypeChange = (value: ActivityType | "all") => {
    setTypeFilter(value);
    setCursor(undefined);
  };

  const handleDateChange = (value: DateFilter) => {
    setDateFilter(value);
    setCursor(undefined);
  };

  return (
    <div>
      {/* Filter Controls */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {/* Type Filter */}
        <div>
          <label
            style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              color: "var(--color-ink-muted)",
              marginBottom: "0.375rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) =>
              handleTypeChange(e.target.value as ActivityType | "all")
            }
            style={selectStyle}
          >
            <option value="all">All Types</option>
            <option value="procedure_started">Started Procedures</option>
            <option value="procedure_completed">Completed Procedures</option>
            <option value="checklist_completed">Completed Checklists</option>
            <option value="form_submitted">Submitted Forms</option>
            <option value="form_received">Received Forms</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label
            style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              color: "var(--color-ink-muted)",
              marginBottom: "0.375rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Time Range
          </label>
          <select
            value={dateFilter}
            onChange={(e) => handleDateChange(e.target.value as DateFilter)}
            style={selectStyle}
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      {isLoading ? (
        <ContentBox>
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              color: "var(--color-ink-muted)",
            }}
          >
            Loading activity...
          </div>
        </ContentBox>
      ) : activity.length === 0 ? (
        <ContentBox>
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                color: "var(--color-ink-muted)",
                marginBottom: "0.5rem",
              }}
            >
              No activity found
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-ink-light)",
              }}
            >
              {typeFilter !== "all" || dateFilter !== "all"
                ? "Try adjusting your filters"
                : "Your activity will appear here as you work"}
            </div>
          </div>
        </ContentBox>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {activity.map((item) => {
              const link = getActivityLink(item);

              return (
                <ContentBox key={item._id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          item.type === "procedure_completed" ||
                          item.type === "checklist_completed"
                            ? "rgba(74, 124, 89, 0.1)"
                            : item.type === "form_received"
                            ? "rgba(138, 109, 76, 0.1)"
                            : "var(--color-surface-dim)",
                        borderRadius: "0",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "1.25rem",
                          color:
                            item.type === "procedure_completed" ||
                            item.type === "checklist_completed"
                              ? "var(--color-success, #4A7C59)"
                              : item.type === "form_received"
                              ? "var(--color-accent)"
                              : "var(--color-ink-muted)",
                        }}
                      >
                        {getActivityIcon(item.type)}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--text-xs)",
                          fontWeight: 500,
                          color: "var(--color-ink-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {getActivityTypeLabel(item.type)}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--text-lg)",
                          fontWeight: 500,
                          color: "var(--color-ink)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--text-sm)",
                          color: "var(--color-ink-light)",
                        }}
                      >
                        {formatFullDate(item.createdAt)}
                      </div>

                      {/* View link */}
                      {link && (
                        <div style={{ marginTop: "0.75rem" }}>
                          <Link
                            href={link}
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "var(--text-sm)",
                              fontWeight: 500,
                              color: "var(--color-accent)",
                              textDecoration: "none",
                              display: "inline-flex",
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
                            {item.formSubmissionId
                              ? "View Submission"
                              : "View Document"}
                            <span style={{ fontSize: "var(--text-xs)" }}>
                              {"\u2192"}
                            </span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </ContentBox>
              );
            })}
          </div>

          {/* Load More */}
          {nextCursor && (
            <div
              style={{
                marginTop: "1.5rem",
                textAlign: "center",
              }}
            >
              <button
                onClick={handleLoadMore}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: "var(--color-ink)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0",
                  padding: "0.625rem 1.5rem",
                  cursor: "pointer",
                  transition: "all 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                  e.currentTarget.style.color = "var(--color-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.color = "var(--color-ink)";
                }}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
