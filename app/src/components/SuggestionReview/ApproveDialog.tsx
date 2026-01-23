"use client";

interface ApproveDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  reviewNote: string;
  onReviewNoteChange: (note: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ApproveDialog({
  isOpen,
  isSubmitting,
  reviewNote,
  onReviewNoteChange,
  onConfirm,
  onCancel,
}: ApproveDialogProps) {
  if (!isOpen) return null;

  return (
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
      onClick={onCancel}
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
          onChange={(e) => onReviewNoteChange(e.target.value)}
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
            onClick={onCancel}
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
            onClick={onConfirm}
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
  );
}
