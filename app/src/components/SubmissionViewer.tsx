"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface SubmissionViewerProps {
  submissionId: Id<"formSubmissions">;
  formTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

export function SubmissionViewer({
  submissionId,
  formTitle,
  isOpen,
  onClose,
  onDeleted,
}: SubmissionViewerProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const submission = useQuery(api.forms.getSubmission, { id: submissionId });
  const deleteSubmission = useMutation(api.forms.deleteSubmission);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSubmission({ id: submissionId });
      onDeleted?.();
      onClose();
    } catch (err) {
      console.error("Failed to delete submission:", err);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Parse submission data JSON
  const parseSubmissionData = (dataJson: string): Record<string, any> => {
    try {
      return JSON.parse(dataJson);
    } catch {
      return {};
    }
  };

  // Format field value for display
  const formatFieldValue = (value: any): string => {
    if (value === null || value === undefined) {
      return "-";
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    return String(value);
  };

  // Format date for display
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format field name to label
  const fieldNameToLabel = (name: string): string => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            Submission Details
          </h2>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              padding: 0,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--color-ink-muted)",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-ink-muted)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        {!submission ? (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ink-muted)",
            }}
          >
            Loading submission...
          </div>
        ) : (
          <div style={{ padding: "1.5rem" }}>
            {/* Form and respondent info */}
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "var(--color-surface-dim, #F8F8F6)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--color-ink)",
                  marginBottom: "0.5rem",
                }}
              >
                {formTitle}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  color: "var(--color-ink-light)",
                }}
              >
                <div>
                  <strong>From:</strong>{" "}
                  {submission.respondentName || "Anonymous"}
                  {submission.respondentEmail && (
                    <span style={{ color: "var(--color-ink-muted)" }}>
                      {" "}
                      ({submission.respondentEmail})
                    </span>
                  )}
                </div>
                <div>
                  <strong>Submitted:</strong> {formatDate(submission.submittedAt)}
                </div>
              </div>
            </div>

            {/* Field values */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {Object.entries(parseSubmissionData(submission.data)).map(
                ([fieldName, value]) => (
                  <div
                    key={fieldName}
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      paddingBottom: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "var(--color-ink-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {fieldNameToLabel(fieldName)}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.875rem",
                        color: "var(--color-ink)",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {formatFieldValue(value)}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-surface-dim, #F8F8F6)",
          }}
        >
          {showDeleteConfirm ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "#C75050",
              }}
            >
              <span>Delete this submission?</span>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                  padding: "0.375rem 0.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-surface)",
                  background: "#C75050",
                  border: "none",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  opacity: isDeleting ? 0.7 : 1,
                }}
              >
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: "0.375rem 0.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-ink)",
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.5rem 0.875rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "#C75050",
                background: "rgba(199, 80, 80, 0.1)",
                border: "1px solid rgba(199, 80, 80, 0.2)",
                cursor: "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 3.5H11.5M5.25 3.5V2.5C5.25 2.08579 5.58579 1.75 6 1.75H8C8.41421 1.75 8.75 2.08579 8.75 2.5V3.5M10.5 3.5V11.5C10.5 11.9142 10.1642 12.25 9.75 12.25H4.25C3.83579 12.25 3.5 11.9142 3.5 11.5V3.5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Delete
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              padding: "0.625rem 1.25rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--color-ink)",
              background: "transparent",
              border: "1px solid var(--color-border)",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
