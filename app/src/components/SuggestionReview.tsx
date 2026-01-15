"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { SuggestionDiff } from "./SuggestionDiff";
import { usePermissions } from "@/hooks/usePermissions";

interface SuggestionReviewProps {
  suggestionId: Id<"suggestions">;
}

type ViewMode = "suggestion" | "compare";

export function SuggestionReview({ suggestionId }: SuggestionReviewProps) {
  const { isManager, isLoading: permissionsLoading } = usePermissions();
  const suggestion = useQuery(api.suggestions.getById, { id: suggestionId });

  const approveMutation = useMutation(api.suggestions.approve);
  const rejectMutation = useMutation(api.suggestions.reject);
  const promoteMutation = useMutation(api.suggestions.promote);

  const [viewMode, setViewMode] = useState<ViewMode>("suggestion");
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Loading state
  if (suggestion === undefined || permissionsLoading) {
    return (
      <div
        style={{
          padding: "2rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-muted)",
          textAlign: "center",
        }}
      >
        Loading suggestion...
      </div>
    );
  }

  // Not found
  if (suggestion === null) {
    return (
      <div
        style={{
          padding: "2rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-muted)",
          textAlign: "center",
        }}
      >
        Suggestion not found
      </div>
    );
  }

  const handleApprove = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await approveMutation({
        id: suggestionId,
        reviewNote: reviewNote.trim() || undefined,
      });
      setShowApproveDialog(false);
      setReviewNote("");
      setFeedback({ type: "success", message: "Suggestion approved successfully" });
    } catch (error) {
      console.error("Failed to approve:", error);
      setFeedback({ type: "error", message: "Failed to approve suggestion. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!reviewNote.trim()) {
      setFeedback({ type: "error", message: "Please provide a reason for rejection" });
      return;
    }
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await rejectMutation({
        id: suggestionId,
        reviewNote: reviewNote.trim(),
      });
      setShowRejectDialog(false);
      setReviewNote("");
      setFeedback({ type: "success", message: "Suggestion rejected" });
    } catch (error) {
      console.error("Failed to reject:", error);
      setFeedback({ type: "error", message: "Failed to reject suggestion. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePromote = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await promoteMutation({ id: suggestionId });
      setFeedback({ type: "success", message: "Changes applied to document successfully" });
    } catch (error) {
      console.error("Failed to promote:", error);
      setFeedback({ type: "error", message: "Failed to apply changes. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusBadge = () => {
    const statusColors: Record<string, { bg: string; text: string }> = {
      draft: { bg: "rgba(100, 100, 100, 0.1)", text: "#666" },
      pending: { bg: "rgba(234, 179, 8, 0.1)", text: "#b45309" },
      approved: { bg: "rgba(21, 128, 61, 0.1)", text: "#15803d" },
      rejected: { bg: "rgba(185, 28, 28, 0.1)", text: "#b91c1c" },
    };
    const colors = statusColors[suggestion.status] || statusColors.draft;

    return (
      <span
        style={{
          display: "inline-block",
          padding: "0.25rem 0.75rem",
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          background: colors.bg,
          color: colors.text,
          borderRadius: "2px",
        }}
      >
        {suggestion.status}
      </span>
    );
  };

  return (
    <div>
      {/* Feedback message */}
      {feedback && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            background: feedback.type === "success" ? "rgba(21, 128, 61, 0.1)" : "rgba(185, 28, 28, 0.1)",
            color: feedback.type === "success" ? "#15803d" : "#b91c1c",
            border: `1px solid ${feedback.type === "success" ? "rgba(21, 128, 61, 0.2)" : "rgba(185, 28, 28, 0.2)"}`,
          }}
        >
          {feedback.message}
        </div>
      )}

      {/* Header with metadata */}
      <div
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          background: "var(--color-surface-dim)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
          {getStatusBadge()}
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--color-ink-muted)",
            }}
          >
            Submitted {formatDate(suggestion.createdAt)}
          </span>
        </div>

        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink)",
            marginBottom: "0.5rem",
          }}
        >
          <strong>Author:</strong> {suggestion.authorDisplayName}
        </div>

        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink)",
          }}
        >
          <strong>Change Note:</strong> {suggestion.changeNote}
        </div>

        {suggestion.reviewerDisplayName && (
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ink)",
              marginTop: "0.5rem",
            }}
          >
            <strong>Reviewed by:</strong> {suggestion.reviewerDisplayName}
            {suggestion.reviewNote && (
              <span style={{ fontStyle: "italic", marginLeft: "0.5rem" }}>
                &ldquo;{suggestion.reviewNote}&rdquo;
              </span>
            )}
          </div>
        )}
      </div>

      {/* View mode tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={() => setViewMode("suggestion")}
          style={{
            padding: "0.5rem 1rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            fontWeight: viewMode === "suggestion" ? 600 : 400,
            color: viewMode === "suggestion" ? "var(--color-accent)" : "var(--color-ink-muted)",
            background: viewMode === "suggestion" ? "rgba(139, 115, 85, 0.1)" : "transparent",
            border: "1px solid",
            borderColor: viewMode === "suggestion" ? "var(--color-accent)" : "var(--color-border)",
            borderRadius: "2px",
            cursor: "pointer",
          }}
        >
          View Suggestion
        </button>
        <button
          onClick={() => setViewMode("compare")}
          style={{
            padding: "0.5rem 1rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            fontWeight: viewMode === "compare" ? 600 : 400,
            color: viewMode === "compare" ? "var(--color-accent)" : "var(--color-ink-muted)",
            background: viewMode === "compare" ? "rgba(139, 115, 85, 0.1)" : "transparent",
            border: "1px solid",
            borderColor: viewMode === "compare" ? "var(--color-accent)" : "var(--color-border)",
            borderRadius: "2px",
            cursor: "pointer",
          }}
        >
          Compare to Current
        </button>
      </div>

      {/* Content area */}
      <div
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          background: "var(--color-background)",
        }}
      >
        {viewMode === "suggestion" ? (
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                marginBottom: "1rem",
              }}
            >
              {suggestion.title}
            </h3>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: "var(--color-ink)",
                whiteSpace: "pre-wrap",
              }}
            >
              {suggestion.content}
            </div>
          </div>
        ) : (
          <SuggestionDiff
            originalTitle={suggestion.documentTitle}
            originalContent={suggestion.documentContent || ""}
            suggestedTitle={suggestion.title}
            suggestedContent={suggestion.content}
          />
        )}
      </div>

      {/* Review actions for managers/admins */}
      {isManager && suggestion.status === "pending" && (
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            padding: "1rem",
            background: "var(--color-surface-dim)",
            border: "1px solid var(--color-border)",
            borderRadius: "4px",
          }}
        >
          <button
            onClick={() => setShowApproveDialog(true)}
            disabled={isSubmitting}
            style={{
              padding: "0.5rem 1.25rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#fff",
              background: "#15803d",
              border: "none",
              borderRadius: "2px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            Approve
          </button>
          <button
            onClick={() => setShowRejectDialog(true)}
            disabled={isSubmitting}
            style={{
              padding: "0.5rem 1.25rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#b91c1c",
              background: "transparent",
              border: "1px solid #b91c1c",
              borderRadius: "2px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            Reject
          </button>
        </div>
      )}

      {/* Apply changes button for approved suggestions */}
      {isManager && suggestion.status === "approved" && !suggestion.appliedAt && (
        <div
          style={{
            padding: "1rem",
            background: "rgba(21, 128, 61, 0.05)",
            border: "1px solid rgba(21, 128, 61, 0.2)",
            borderRadius: "4px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ink)",
              marginBottom: "0.75rem",
            }}
          >
            This suggestion has been approved. Apply the changes to update the official document.
          </p>
          <button
            onClick={handlePromote}
            disabled={isSubmitting}
            style={{
              padding: "0.5rem 1.25rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#fff",
              background: "var(--color-accent)",
              border: "none",
              borderRadius: "2px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting ? "Applying..." : "Apply Changes"}
          </button>
        </div>
      )}

      {/* Applied indicator */}
      {suggestion.appliedAt && (
        <div
          style={{
            padding: "1rem",
            background: "rgba(21, 128, 61, 0.05)",
            border: "1px solid rgba(21, 128, 61, 0.2)",
            borderRadius: "4px",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "#15803d",
          }}
        >
          Changes applied to document on {formatDate(suggestion.appliedAt)}
        </div>
      )}

      {/* Approve Dialog */}
      {showApproveDialog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowApproveDialog(false)}
        >
          <div
            style={{
              background: "var(--color-surface)",
              padding: "1.5rem",
              borderRadius: "4px",
              maxWidth: "400px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              Approve Suggestion
            </h3>
            <textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Add a review note (optional)"
              rows={3}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
                resize: "vertical",
                marginBottom: "1rem",
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowApproveDialog(false)}
                style={{
                  padding: "0.5rem 1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--color-ink-muted)",
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                style={{
                  padding: "0.5rem 1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#fff",
                  background: "#15803d",
                  border: "none",
                  borderRadius: "2px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Approving..." : "Confirm Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowRejectDialog(false)}
        >
          <div
            style={{
              background: "var(--color-surface)",
              padding: "1.5rem",
              borderRadius: "4px",
              maxWidth: "400px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              Reject Suggestion
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--color-ink-muted)",
                marginBottom: "0.75rem",
              }}
            >
              Please provide a reason for rejection to help the author understand.
            </p>
            <textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Reason for rejection (required)"
              rows={3}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
                resize: "vertical",
                marginBottom: "1rem",
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowRejectDialog(false)}
                style={{
                  padding: "0.5rem 1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--color-ink-muted)",
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting || !reviewNote.trim()}
                style={{
                  padding: "0.5rem 1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#fff",
                  background: "#b91c1c",
                  border: "none",
                  borderRadius: "2px",
                  cursor: isSubmitting || !reviewNote.trim() ? "not-allowed" : "pointer",
                  opacity: isSubmitting || !reviewNote.trim() ? 0.6 : 1,
                }}
              >
                {isSubmitting ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
