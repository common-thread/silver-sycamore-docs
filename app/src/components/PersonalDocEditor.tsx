"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import ReactMarkdown from "react-markdown";

interface PersonalDocEditorProps {
  docId: Id<"personalDocuments">;
  initialTitle: string;
  initialContent: string;
}

export function PersonalDocEditor({
  docId,
  initialTitle,
  initialContent,
}: PersonalDocEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const updateDoc = useMutation(api.personalDocuments.update);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced save
  const save = useCallback(async (newTitle: string, newContent: string) => {
    setSaveStatus("saving");
    try {
      await updateDoc({
        id: docId,
        title: newTitle,
        content: newContent,
      });
      setSaveStatus("saved");
    } catch (error) {
      console.error("Failed to save:", error);
      setSaveStatus("unsaved");
    }
  }, [docId, updateDoc]);

  const debouncedSave = useCallback((newTitle: string, newContent: string) => {
    setSaveStatus("unsaved");
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      save(newTitle, newContent);
    }, 1000);
  }, [save]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debouncedSave(newTitle, content);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    debouncedSave(title, newContent);
  };

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--color-ink-muted)",
          }}
        >
          {saveStatus === "saved" && (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#15803d" strokeWidth="1.2" />
                <path d="M4 7L6 9L10 5" stroke="#15803d" strokeWidth="1.2" />
              </svg>
              Saved
            </>
          )}
          {saveStatus === "saving" && (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <circle
                  cx="7"
                  cy="7"
                  r="5"
                  stroke="var(--color-ink-muted)"
                  strokeWidth="1.2"
                  strokeDasharray="20"
                  strokeDashoffset="10"
                />
              </svg>
              Saving...
            </>
          )}
          {saveStatus === "unsaved" && (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="var(--color-accent)" strokeWidth="1.2" />
              </svg>
              Unsaved
            </>
          )}
        </div>

        <button
          onClick={() => setShowPreview(!showPreview)}
          style={{
            padding: "0.375rem 0.75rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: showPreview ? "var(--color-surface)" : "var(--color-ink-light)",
            background: showPreview ? "var(--color-ink)" : "transparent",
            border: "1px solid var(--color-border)",
            borderRadius: "2px",
            cursor: "pointer",
          }}
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {/* Title input */}
      <input
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Document title"
        style={{
          width: "100%",
          padding: "0.5rem 0",
          fontFamily: "var(--font-display)",
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "var(--color-ink)",
          background: "transparent",
          border: "none",
          borderBottom: "1px solid var(--color-border)",
          outline: "none",
          marginBottom: "1rem",
        }}
      />

      {/* Content editor or preview */}
      {showPreview ? (
        <div
          style={{
            padding: "1rem",
            background: "var(--color-background)",
            border: "1px solid var(--color-border)",
            borderRadius: "2px",
            minHeight: "400px",
          }}
        >
          <div className="prose">
            <ReactMarkdown>{content || "*No content*"}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start writing... (Markdown supported)"
          style={{
            width: "100%",
            minHeight: "400px",
            padding: "1rem",
            fontFamily: "monospace",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: "var(--color-ink)",
            background: "var(--color-background)",
            border: "1px solid var(--color-border)",
            borderRadius: "2px",
            outline: "none",
            resize: "vertical",
          }}
        />
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
