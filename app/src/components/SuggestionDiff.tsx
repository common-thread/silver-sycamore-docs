"use client";

import { useMemo } from "react";

interface SuggestionDiffProps {
  originalTitle: string;
  originalContent: string;
  suggestedTitle: string;
  suggestedContent: string;
}

// Simple line-by-line diff (reused from VersionCompare pattern)
function computeDiff(oldText: string, newText: string) {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  const diff: Array<{ type: "same" | "added" | "removed"; content: string }> = [];

  const oldSet = new Set(oldLines);
  const newSet = new Set(newLines);

  let oldIdx = 0;
  let newIdx = 0;

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    const oldLine = oldLines[oldIdx];
    const newLine = newLines[newIdx];

    if (oldIdx >= oldLines.length) {
      diff.push({ type: "added", content: newLine });
      newIdx++;
    } else if (newIdx >= newLines.length) {
      diff.push({ type: "removed", content: oldLine });
      oldIdx++;
    } else if (oldLine === newLine) {
      diff.push({ type: "same", content: oldLine });
      oldIdx++;
      newIdx++;
    } else if (!newSet.has(oldLine)) {
      diff.push({ type: "removed", content: oldLine });
      oldIdx++;
    } else if (!oldSet.has(newLine)) {
      diff.push({ type: "added", content: newLine });
      newIdx++;
    } else {
      diff.push({ type: "removed", content: oldLine });
      diff.push({ type: "added", content: newLine });
      oldIdx++;
      newIdx++;
    }
  }

  return diff;
}

export function SuggestionDiff({
  originalTitle,
  originalContent,
  suggestedTitle,
  suggestedContent,
}: SuggestionDiffProps) {
  const diff = useMemo(
    () => computeDiff(originalContent, suggestedContent),
    [originalContent, suggestedContent]
  );

  const hasChanges = diff.some((d) => d.type !== "same");
  const titleChanged = originalTitle !== suggestedTitle;

  return (
    <div>
      {/* Title change */}
      {titleChanged && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            background: "var(--color-background)",
            border: "1px solid var(--color-border)",
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "var(--color-ink-muted)",
              marginBottom: "0.5rem",
            }}
          >
            Title Changed
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "#b91c1c",
                textDecoration: "line-through",
              }}
            >
              {originalTitle}
            </span>
            <span style={{ color: "var(--color-ink-muted)" }}>→</span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "#15803d",
              }}
            >
              {suggestedTitle}
            </span>
          </div>
        </div>
      )}

      {/* Content diff */}
      {!hasChanges ? (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          No content changes
        </div>
      ) : (
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "0.8125rem",
            lineHeight: 1.6,
            background: "var(--color-background)",
            border: "1px solid var(--color-border)",
            borderRadius: "2px",
            overflow: "auto",
            maxHeight: "500px",
          }}
        >
          {diff.map((line, idx) => (
            <div
              key={idx}
              style={{
                padding: "0.125rem 0.75rem",
                background:
                  line.type === "added"
                    ? "rgba(21, 128, 61, 0.1)"
                    : line.type === "removed"
                      ? "rgba(185, 28, 28, 0.1)"
                      : "transparent",
                borderLeft:
                  line.type === "added"
                    ? "3px solid #15803d"
                    : line.type === "removed"
                      ? "3px solid #b91c1c"
                      : "3px solid transparent",
                color:
                  line.type === "added"
                    ? "#15803d"
                    : line.type === "removed"
                      ? "#b91c1c"
                      : "var(--color-ink)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              <span style={{ opacity: 0.5, marginRight: "0.5rem" }}>
                {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
              </span>
              {line.content || " "}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
