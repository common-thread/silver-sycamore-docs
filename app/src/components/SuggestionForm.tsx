"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Lazy load the rich text editor to avoid SSR issues
const RichTextEditor = lazy(() => import("./RichTextEditor"));

interface SuggestionFormProps {
  // For creating a new suggestion from a document
  documentId?: Id<"documents">;
  // For editing an existing draft
  suggestionId?: Id<"suggestions">;
  // Callback after successful save
  onSave?: (id: Id<"suggestions">) => void;
  // Callback after successful submit
  onSubmit?: () => void;
}

export function SuggestionForm({
  documentId,
  suggestionId,
  onSave,
  onSubmit,
}: SuggestionFormProps) {
  // Fetch document for new suggestion
  const document = useQuery(
    api.documents.byId,
    documentId ? { id: documentId } : "skip"
  );

  // Fetch existing suggestion for editing
  const existingSuggestion = useQuery(
    api.suggestions.getById,
    suggestionId ? { id: suggestionId } : "skip"
  );

  // Mutations
  const createSuggestion = useMutation(api.suggestions.create);
  const updateSuggestion = useMutation(api.suggestions.update);
  const submitSuggestion = useMutation(api.suggestions.submit);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [changeNote, setChangeNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form from document or existing suggestion
  useEffect(() => {
    if (document && !suggestionId) {
      setTitle(document.title);
      setContent(document.content);
    }
  }, [document, suggestionId]);

  useEffect(() => {
    if (existingSuggestion) {
      setTitle(existingSuggestion.title);
      setContent(existingSuggestion.content);
      setChangeNote(existingSuggestion.changeNote);
    }
  }, [existingSuggestion]);

  const handleSaveDraft = async () => {
    if (!changeNote.trim()) {
      setError("Please describe your changes");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (suggestionId) {
        // Update existing draft
        await updateSuggestion({
          id: suggestionId,
          title,
          content,
          changeNote,
        });
        setSuccessMessage("Draft saved");
        onSave?.(suggestionId);
      } else if (documentId) {
        // Create new suggestion
        const id = await createSuggestion({
          documentId,
          title,
          content,
          changeNote,
        });
        setSuccessMessage("Draft created");
        onSave?.(id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!suggestionId) {
      setError("Please save your draft first");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await submitSuggestion({ id: suggestionId });
      setSuccessMessage("Submitted for review!");
      onSubmit?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading states
  if (documentId && document === undefined) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-muted)",
        }}
      >
        Loading document...
      </div>
    );
  }

  if (suggestionId && existingSuggestion === undefined) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-muted)",
        }}
      >
        Loading suggestion...
      </div>
    );
  }

  if (documentId && document === null) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-muted)",
        }}
      >
        Document not found
      </div>
    );
  }

  if (suggestionId && existingSuggestion === null) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-muted)",
        }}
      >
        Suggestion not found
      </div>
    );
  }

  const isDraft = !suggestionId || existingSuggestion?.status === "draft";
  const isReadOnly = suggestionId && existingSuggestion?.status !== "draft";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Status indicator for non-draft */}
      {isReadOnly && existingSuggestion && (
        <div
          style={{
            padding: "1rem",
            background: "var(--color-surface-dim)",
            borderRadius: "4px",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
            }}
          >
            <span style={{ color: "var(--color-ink-muted)" }}>Status:</span>
            <StatusBadge status={existingSuggestion.status} />
          </div>
          {existingSuggestion.reviewNote && (
            <div
              style={{
                marginTop: "0.75rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--color-ink-light)",
              }}
            >
              <strong>Reviewer note:</strong> {existingSuggestion.reviewNote}
            </div>
          )}
        </div>
      )}

      {/* Title field */}
      <div>
        <label
          style={{
            display: "block",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "var(--color-ink-muted)",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!!isReadOnly}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "var(--color-ink)",
            background: isReadOnly ? "var(--color-surface-dim)" : "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "2px",
            outline: "none",
          }}
        />
      </div>

      {/* Content field */}
      <div>
        <label
          style={{
            display: "block",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "var(--color-ink-muted)",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Content
        </label>
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "2px",
            background: isReadOnly ? "var(--color-surface-dim)" : "var(--color-surface)",
            minHeight: "400px",
          }}
        >
          <Suspense
            fallback={
              <div
                style={{
                  padding: "1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--color-ink-muted)",
                }}
              >
                Loading editor...
              </div>
            }
          >
            <RichTextEditor
              content={content}
              onChange={setContent}
              editable={!isReadOnly}
              hideToolbar={!!isReadOnly}
            />
          </Suspense>
        </div>
      </div>

      {/* Change note field */}
      <div>
        <label
          style={{
            display: "block",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "var(--color-ink-muted)",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Change Description
        </label>
        <textarea
          value={changeNote}
          onChange={(e) => setChangeNote(e.target.value)}
          disabled={!!isReadOnly}
          rows={3}
          placeholder="Describe what you changed and why..."
          style={{
            width: "100%",
            padding: "0.75rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            color: "var(--color-ink)",
            background: isReadOnly ? "var(--color-surface-dim)" : "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "2px",
            outline: "none",
            resize: "vertical",
          }}
        />
      </div>

      {/* Error/Success messages */}
      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "2px",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "#dc2626",
          }}
        >
          {error}
        </div>
      )}
      {successMessage && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "2px",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "#16a34a",
          }}
        >
          {successMessage}
        </div>
      )}

      {/* Action buttons */}
      {isDraft && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            justifyContent: "flex-end",
            paddingTop: "0.5rem",
          }}
        >
          <button
            onClick={handleSaveDraft}
            disabled={isSaving || isSubmitting}
            style={{
              padding: "0.625rem 1.25rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-ink-light)",
              background: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: "2px",
              cursor: isSaving ? "not-allowed" : "pointer",
              opacity: isSaving ? 0.6 : 1,
            }}
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </button>

          {suggestionId && (
            <button
              onClick={handleSubmitForReview}
              disabled={isSaving || isSubmitting}
              style={{
                padding: "0.625rem 1.25rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--color-surface)",
                background: "var(--color-accent)",
                border: "none",
                borderRadius: "2px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit for Review"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    draft: { bg: "var(--color-surface-dim)", color: "var(--color-ink-muted)" },
    pending: { bg: "#fef3c7", color: "#92400e" },
    approved: { bg: "#dcfce7", color: "#166534" },
    rejected: { bg: "#fee2e2", color: "#991b1b" },
  };

  const style = styles[status] || styles.draft;

  return (
    <span
      style={{
        padding: "0.25rem 0.625rem",
        fontFamily: "var(--font-body)",
        fontSize: "0.75rem",
        fontWeight: 500,
        textTransform: "capitalize",
        background: style.bg,
        color: style.color,
        borderRadius: "2px",
      }}
    >
      {status}
    </span>
  );
}
