"use client";

interface RejectDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  reviewNote: string;
  onReviewNoteChange: (note: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RejectDialog({
  isOpen,
  isSubmitting,
  reviewNote,
  onReviewNoteChange,
  onConfirm,
  onCancel,
}: RejectDialogProps) {
  if (!isOpen) return null;

  const isDisabled = isSubmitting || !reviewNote.trim();

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
          onChange={(e) => onReviewNoteChange(e.target.value)}
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
            disabled={isDisabled}
            style={{
              padding: "0.5rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#fff",
              background: "#b91c1c",
              border: "none",
              borderRadius: "2px",
              cursor: isDisabled ? "not-allowed" : "pointer",
              opacity: isDisabled ? 0.6 : 1,
            }}
          >
            {isSubmitting ? "Rejecting..." : "Confirm Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}
