"use client";

import { SuggestionDiff } from "../SuggestionDiff";
import { Suggestion, ViewMode } from "./types";

interface SuggestionContentProps {
  suggestion: Suggestion;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function SuggestionContent({ suggestion, viewMode, onViewModeChange }: SuggestionContentProps) {
  return (
    <>
      {/* View mode tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={() => onViewModeChange("suggestion")}
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
          onClick={() => onViewModeChange("compare")}
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
    </>
  );
}
