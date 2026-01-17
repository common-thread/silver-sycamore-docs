"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface ChecklistViewProps {
  document: {
    _id: string;
    title: string;
    content: string;
    contentType?: string;
  };
  instanceId?: string;
}

/**
 * Parse checklist content into items from markdown list syntax.
 * Extracts items from lines starting with - or * (with optional [ ] checkbox)
 */
function parseChecklistItems(content: string): string[] {
  const listRegex = /^[-*]\s+(?:\[[ x]\]\s+)?(.+)$/gm;
  const items: string[] = [];
  let match;
  while ((match = listRegex.exec(content)) !== null) {
    items.push(match[1].trim());
  }
  return items;
}

export function ChecklistView({ document, instanceId: propInstanceId }: ChecklistViewProps) {
  const [isStarting, setIsStarting] = useState(false);

  // Query for existing instance
  const existingInstance = useQuery(
    api.dynamicContent.getInstanceForDocument,
    { documentId: document._id as Id<"documents"> }
  );

  // Query for instance details if we have an ID
  const instanceFromProp = useQuery(
    api.dynamicContent.getInstance,
    propInstanceId ? { instanceId: propInstanceId as Id<"dynamicContentInstances"> } : "skip"
  );

  // Use prop instance or existing instance
  const instance = instanceFromProp || existingInstance;

  // Mutations
  const startInstance = useMutation(api.dynamicContent.startInstance);
  const completeStep = useMutation(api.dynamicContent.completeStep);

  // Parse items from content
  const items = useMemo(() => parseChecklistItems(document.content), [document.content]);

  // Get completion state from instance
  const completionData = useMemo(() => {
    if (!instance?.completionData) {
      return { steps: items.map(() => false) };
    }
    try {
      return JSON.parse(instance.completionData) as { steps: boolean[] };
    } catch {
      return { steps: items.map(() => false) };
    }
  }, [instance?.completionData, items]);

  const completedCount = instance?.completedSteps ?? 0;
  const totalCount = instance?.totalSteps ?? items.length;

  const handleStartChecklist = async () => {
    setIsStarting(true);
    try {
      await startInstance({ documentId: document._id as Id<"documents"> });
    } catch (error) {
      console.error("Failed to start checklist:", error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleItemToggle = async (itemIndex: number, completed: boolean) => {
    if (!instance?._id) return;
    try {
      await completeStep({
        instanceId: instance._id,
        stepIndex: itemIndex,
        completed,
      });
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleReset = async () => {
    if (!instance?._id) return;
    // Uncheck all items
    for (let i = 0; i < completionData.steps.length; i++) {
      if (completionData.steps[i]) {
        await completeStep({
          instanceId: instance._id,
          stepIndex: i,
          completed: false,
        });
      }
    }
  };

  const handleMarkAll = async () => {
    if (!instance?._id) return;
    // Check all items
    for (let i = 0; i < completionData.steps.length; i++) {
      if (!completionData.steps[i]) {
        await completeStep({
          instanceId: instance._id,
          stepIndex: i,
          completed: true,
        });
      }
    }
  };

  // If no instance, show start button
  if (!instance) {
    return (
      <div>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-6)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-2xl)",
              fontWeight: "var(--font-semibold)",
              color: "var(--color-ink)",
            }}
          >
            {document.title}
          </h1>
          <span
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-ink-muted)",
            }}
          >
            {items.length} items
          </span>
        </div>

        {/* Start Checklist Card */}
        <div
          style={{
            background: "var(--color-paper-warm)",
            border: "1px solid var(--color-border)",
            borderRadius: "0",
            padding: "var(--space-8)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "var(--color-ink-light)",
              marginBottom: "var(--space-4)",
              fontSize: "var(--text-base)",
            }}
          >
            This checklist has {items.length} items.
          </p>
          <button
            onClick={handleStartChecklist}
            disabled={isStarting}
            style={{
              background: "var(--color-accent)",
              color: "var(--color-paper-white)",
              padding: "var(--space-3) var(--space-6)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-medium)",
              border: "none",
              borderRadius: "0",
              cursor: isStarting ? "not-allowed" : "pointer",
              opacity: isStarting ? 0.6 : 1,
              transition: "background var(--duration-normal) var(--ease-default)",
            }}
            onMouseEnter={(e) => {
              if (!isStarting) {
                e.currentTarget.style.background = "var(--color-accent-hover)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-accent)";
            }}
          >
            {isStarting ? "Starting..." : "Start Checklist"}
          </button>
        </div>

        {/* Preview items */}
        <div style={{ marginTop: "var(--space-6)" }}>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "var(--space-3) var(--space-4)",
                borderBottom: "1px solid var(--color-border)",
                color: "var(--color-ink-muted)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid var(--color-border-strong)",
                  borderRadius: "0",
                }}
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active checklist with completion tracking
  return (
    <div>
      {/* Header with count */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-6)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            fontWeight: "var(--font-semibold)",
            color: "var(--color-ink)",
          }}
        >
          {document.title}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          {instance.status === "completed" && (
            <span
              style={{
                background: "var(--color-success-light)",
                color: "var(--color-success-dark)",
                padding: "var(--space-1) var(--space-3)",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-medium)",
                borderRadius: "0",
              }}
            >
              All Done
            </span>
          )}
          <span
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-ink-muted)",
            }}
          >
            {completedCount}/{totalCount} items
          </span>
        </div>
      </div>

      {/* Items List */}
      <div
        style={{
          border: "1px solid var(--color-border)",
          borderRadius: "0",
          background: "var(--color-surface)",
        }}
      >
        {items.map((item, index) => {
          const isChecked = completionData.steps[index] ?? false;
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                padding: "var(--space-4)",
                borderBottom: index < items.length - 1 ? "1px solid var(--color-border)" : "none",
                background: isChecked ? "var(--color-paper-warm)" : "transparent",
                cursor: "pointer",
                transition: "background var(--duration-fast) var(--ease-default)",
              }}
              onClick={() => handleItemToggle(index, !isChecked)}
            >
              {/* Checkbox */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  minWidth: "20px",
                  border: `2px solid ${isChecked ? "var(--color-success)" : "var(--color-border-strong)"}`,
                  borderRadius: "0",
                  background: isChecked ? "var(--color-success)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all var(--duration-fast) var(--ease-default)",
                }}
              >
                {isChecked && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{ color: "var(--color-paper-white)" }}
                  >
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              {/* Item Text */}
              <span
                style={{
                  flex: 1,
                  fontSize: "var(--text-base)",
                  color: isChecked ? "var(--color-ink-muted)" : "var(--color-ink)",
                  textDecoration: isChecked ? "line-through" : "none",
                  transition: "color var(--duration-fast) var(--ease-default)",
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "var(--space-4)",
          gap: "var(--space-3)",
        }}
      >
        <button
          onClick={handleReset}
          disabled={completedCount === 0}
          style={{
            background: "transparent",
            color: completedCount === 0 ? "var(--color-ink-subtle)" : "var(--color-ink-light)",
            padding: "var(--space-2) var(--space-4)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-medium)",
            border: "1px solid var(--color-border)",
            borderRadius: "0",
            cursor: completedCount === 0 ? "not-allowed" : "pointer",
            opacity: completedCount === 0 ? 0.5 : 1,
            transition: "all var(--duration-normal) var(--ease-default)",
          }}
          onMouseEnter={(e) => {
            if (completedCount > 0) {
              e.currentTarget.style.borderColor = "var(--color-border-strong)";
              e.currentTarget.style.color = "var(--color-ink)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-ink-light)";
          }}
        >
          Reset
        </button>
        <button
          onClick={handleMarkAll}
          disabled={completedCount === totalCount}
          style={{
            background: completedCount === totalCount ? "var(--color-paper-warm)" : "var(--color-accent)",
            color: completedCount === totalCount ? "var(--color-ink-subtle)" : "var(--color-paper-white)",
            padding: "var(--space-2) var(--space-4)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-medium)",
            border: "none",
            borderRadius: "0",
            cursor: completedCount === totalCount ? "not-allowed" : "pointer",
            opacity: completedCount === totalCount ? 0.5 : 1,
            transition: "all var(--duration-normal) var(--ease-default)",
          }}
          onMouseEnter={(e) => {
            if (completedCount < totalCount) {
              e.currentTarget.style.background = "var(--color-accent-hover)";
            }
          }}
          onMouseLeave={(e) => {
            if (completedCount < totalCount) {
              e.currentTarget.style.background = "var(--color-accent)";
            }
          }}
        >
          Mark All
        </button>
      </div>

      {/* Completion Info */}
      {instance.status === "completed" && instance.completedAt && (
        <div
          style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-4)",
            background: "var(--color-success-light)",
            borderRadius: "0",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{ color: "var(--color-success)" }}
          >
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
            <path
              d="M6 10L9 13L14 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              color: "var(--color-success-dark)",
              fontSize: "var(--text-sm)",
            }}
          >
            Completed on {new Date(instance.completedAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}
    </div>
  );
}
