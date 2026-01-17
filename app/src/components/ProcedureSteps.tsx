"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import ReactMarkdown from "react-markdown";

interface ProcedureStepsProps {
  document: {
    _id: string;
    title: string;
    content: string;
    contentType?: string;
  };
  instanceId?: string;
}

/**
 * Get or create a session ID for anonymous procedure tracking.
 * Stored in localStorage to persist across page refreshes.
 */
function getSessionId(): string {
  if (typeof window === "undefined") return "";

  const key = "silver-sycamore-session-id";
  let sessionId = localStorage.getItem(key);

  if (!sessionId) {
    sessionId = `anon-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(key, sessionId);
  }

  return sessionId;
}

interface ParsedStep {
  title: string;
  content: string;
}

/**
 * Parse procedure content into steps based on h2 headers.
 * Each step includes its title and content until the next h2.
 */
function parseStepsFromContent(content: string): ParsedStep[] {
  const lines = content.split("\n");
  const steps: ParsedStep[] = [];
  let currentStep: ParsedStep | null = null;
  let contentLines: string[] = [];

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      // Save previous step if exists
      if (currentStep) {
        currentStep.content = contentLines.join("\n").trim();
        steps.push(currentStep);
      }
      // Start new step
      currentStep = { title: h2Match[1].trim(), content: "" };
      contentLines = [];
    } else if (currentStep) {
      contentLines.push(line);
    }
  }

  // Save last step
  if (currentStep) {
    currentStep.content = contentLines.join("\n").trim();
    steps.push(currentStep);
  }

  return steps;
}

export function ProcedureSteps({ document, instanceId: propInstanceId }: ProcedureStepsProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  // Get sessionId on mount (client-side only)
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  // Query for existing instance - pass sessionId for anonymous users
  const existingInstance = useQuery(
    api.dynamicContent.getInstanceForDocument,
    sessionId ? { documentId: document._id as Id<"documents">, sessionId } : "skip"
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

  // Parse steps from content
  const steps = useMemo(() => parseStepsFromContent(document.content), [document.content]);

  // Get completion state from instance
  const completionData = useMemo(() => {
    if (!instance?.completionData) {
      return { steps: steps.map(() => false) };
    }
    try {
      return JSON.parse(instance.completionData) as { steps: boolean[] };
    } catch {
      return { steps: steps.map(() => false) };
    }
  }, [instance?.completionData, steps]);

  const completedSteps = instance?.completedSteps ?? 0;
  const totalSteps = instance?.totalSteps ?? steps.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const handleStartProcedure = async () => {
    if (!sessionId) return; // Wait for sessionId to be set
    setIsStarting(true);
    try {
      await startInstance({
        documentId: document._id as Id<"documents">,
        sessionId,
      });
    } catch (error) {
      console.error("Failed to start procedure:", error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStepToggle = async (stepIndex: number, completed: boolean) => {
    if (!instance?._id || !sessionId) return;
    try {
      await completeStep({
        instanceId: instance._id,
        stepIndex,
        completed,
        sessionId,
      });
    } catch (error) {
      console.error("Failed to update step:", error);
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
            {steps.length} steps
          </span>
        </div>

        {/* Start Procedure Card */}
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
            This procedure has {steps.length} steps to complete.
          </p>
          <button
            onClick={handleStartProcedure}
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
            {isStarting ? "Starting..." : "Start Procedure"}
          </button>
        </div>

        {/* Preview steps */}
        <div style={{ marginTop: "var(--space-6)" }}>
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                padding: "var(--space-4)",
                borderBottom: "1px solid var(--color-border)",
                color: "var(--color-ink-muted)",
              }}
            >
              <span style={{ fontWeight: "var(--font-medium)" }}>
                {index + 1}. {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active procedure with progress tracking
  return (
    <div>
      {/* Header with progress */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-2)",
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
              Completed
            </span>
          )}
          <span
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-ink-muted)",
            }}
          >
            {completedSteps}/{totalSteps} steps
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          marginBottom: "var(--space-6)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-2)",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-ink-muted)",
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-wider)",
            }}
          >
            Progress
          </span>
          <span
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-ink-light)",
              fontWeight: "var(--font-medium)",
            }}
          >
            {progressPercent}%
          </span>
        </div>
        <div
          style={{
            height: "8px",
            background: "var(--color-paper-mid)",
            borderRadius: "0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: "var(--color-champagne-dark)",
              transition: "width var(--duration-slow) var(--ease-out)",
            }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div
        style={{
          border: "1px solid var(--color-border)",
          borderRadius: "0",
          background: "var(--color-surface)",
        }}
      >
        {steps.map((step, index) => {
          const isCompleted = completionData.steps[index] ?? false;
          return (
            <div
              key={index}
              style={{
                borderBottom: index < steps.length - 1 ? "1px solid var(--color-border)" : "none",
              }}
            >
              {/* Step Header with Checkbox */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--space-4)",
                  padding: "var(--space-4)",
                  background: isCompleted ? "var(--color-paper-warm)" : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => handleStepToggle(index, !isCompleted)}
              >
                {/* Checkbox */}
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    minWidth: "20px",
                    border: `2px solid ${isCompleted ? "var(--color-success)" : "var(--color-border-strong)"}`,
                    borderRadius: "0",
                    background: isCompleted ? "var(--color-success)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "2px",
                    transition: "all var(--duration-fast) var(--ease-default)",
                  }}
                >
                  {isCompleted && (
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

                {/* Step Title */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-lg)",
                      fontWeight: "var(--font-semibold)",
                      color: isCompleted ? "var(--color-ink-muted)" : "var(--color-ink)",
                      textDecoration: isCompleted ? "line-through" : "none",
                      margin: 0,
                    }}
                  >
                    Step {index + 1}: {step.title}
                  </h3>
                </div>
              </div>

              {/* Step Content */}
              {step.content && (
                <div
                  style={{
                    padding: "0 var(--space-4) var(--space-4)",
                    paddingLeft: "calc(var(--space-4) + 20px + var(--space-4))",
                    opacity: isCompleted ? 0.6 : 1,
                  }}
                >
                  <div className="prose" style={{ maxWidth: "none" }}>
                    <ReactMarkdown>{step.content}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
