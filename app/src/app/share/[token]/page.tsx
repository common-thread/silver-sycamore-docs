"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ProcedureSteps } from "@/components/ProcedureSteps";
import ReactMarkdown from "react-markdown";

// Session ID storage key for anonymous users
const SESSION_ID_KEY = "share_session_id";

// Generate a simple session ID for anonymous users
function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

// Loading spinner component
function LoadingSpinner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-16)",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid var(--color-border)",
          borderTopColor: "var(--color-accent)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Error display component
function ErrorDisplay({
  error,
  message,
}: {
  error: string;
  message: string;
}) {
  // Map error codes to user-friendly displays
  const errorConfig: Record<
    string,
    { title: string; icon: string; color: string }
  > = {
    invalid: {
      title: "Invalid Link",
      icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z",
      color: "var(--color-error)",
    },
    expired: {
      title: "Link Expired",
      icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "var(--color-warning, #B8860B)",
    },
    usage_exceeded: {
      title: "Usage Limit Reached",
      icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z",
      color: "var(--color-warning, #B8860B)",
    },
    access_denied: {
      title: "Access Denied",
      icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
      color: "var(--color-error)",
    },
    not_found: {
      title: "Not Found",
      icon: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z",
      color: "var(--color-ink-muted)",
    },
  };

  const config = errorConfig[error] || errorConfig.invalid;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-background)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "var(--space-8)",
          maxWidth: "400px",
        }}
      >
        {/* Icon */}
        <div
          style={{
            marginBottom: "var(--space-4)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={config.color}
            style={{ width: "48px", height: "48px" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={config.icon} />
          </svg>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontWeight: "var(--font-semibold)",
            color: "var(--color-ink)",
            marginBottom: "var(--space-2)",
          }}
        >
          {config.title}
        </h1>

        {/* Message */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: "var(--color-ink-light)",
            marginBottom: "var(--space-6)",
          }}
        >
          {message}
        </p>

        {/* Login prompt for access denied */}
        {error === "access_denied" && (
          <a
            href="/signin"
            style={{
              display: "inline-block",
              padding: "var(--space-3) var(--space-6)",
              background: "var(--color-accent)",
              color: "var(--color-paper-white)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-medium)",
              textDecoration: "none",
              borderRadius: "0",
            }}
          >
            Sign In
          </a>
        )}
      </div>
    </div>
  );
}

// Checklist renderer for shared checklists
function ChecklistView({
  document,
  sessionId,
}: {
  document: {
    _id: string;
    title: string;
    content: string;
    contentType?: string;
  };
  sessionId: string;
}) {
  // Parse checklist items from markdown content
  const items = document.content
    .split("\n")
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+(?:\[[ x]\]\s+)?/, "").trim());

  const [checkedItems, setCheckedItems] = useState<boolean[]>(() =>
    items.map(() => false)
  );

  const completedCount = checkedItems.filter(Boolean).length;
  const progressPercent =
    items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const handleToggle = (index: number) => {
    setCheckedItems((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div>
      {/* Header */}
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
        <span
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-ink-muted)",
          }}
        >
          {completedCount}/{items.length} items
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: "var(--space-6)" }}>
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

      {/* Checklist Items */}
      <div
        style={{
          border: "1px solid var(--color-border)",
          borderRadius: "0",
          background: "var(--color-surface)",
        }}
      >
        {items.map((item, index) => {
          const isChecked = checkedItems[index];
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-4)",
                padding: "var(--space-4)",
                borderBottom:
                  index < items.length - 1
                    ? "1px solid var(--color-border)"
                    : "none",
                background: isChecked ? "var(--color-paper-warm)" : "transparent",
                cursor: "pointer",
              }}
              onClick={() => handleToggle(index)}
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
                  marginTop: "2px",
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
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  color: isChecked ? "var(--color-ink-muted)" : "var(--color-ink)",
                  textDecoration: isChecked ? "line-through" : "none",
                  flex: 1,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Reference document renderer (read-only markdown)
function ReferenceView({
  document,
}: {
  document: {
    _id: string;
    title: string;
    content: string;
    contentType?: string;
  };
}) {
  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-2xl)",
          fontWeight: "var(--font-semibold)",
          color: "var(--color-ink)",
          marginBottom: "var(--space-6)",
        }}
      >
        {document.title}
      </h1>
      <div className="prose" style={{ maxWidth: "none" }}>
        <ReactMarkdown>{document.content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default function SharePage() {
  const params = useParams();
  const token = params.token as string;
  const hasIncrementedRef = useRef(false);

  // Get session ID for anonymous users
  const [sessionId, setSessionId] = useState("");
  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  // Query share link access
  const accessResult = useQuery(api.sharing.accessViaShareLink, { token });
  const incrementUsage = useMutation(api.sharing.incrementShareLinkUsage);

  // Increment usage count on first successful access
  useEffect(() => {
    if (
      accessResult &&
      "success" in accessResult &&
      accessResult.success &&
      !hasIncrementedRef.current
    ) {
      hasIncrementedRef.current = true;
      incrementUsage({ token }).catch(console.error);
    }
  }, [accessResult, token, incrementUsage]);

  // Loading state
  if (accessResult === undefined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-background)",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if ("error" in accessResult && accessResult.error && accessResult.message) {
    return (
      <ErrorDisplay error={accessResult.error} message={accessResult.message} />
    );
  }

  // Success - we have access, extract content
  // At this point, accessResult has 'success' property and document is defined
  if (!("success" in accessResult) || !accessResult.document) {
    return <ErrorDisplay error="invalid" message="Unable to load content" />;
  }

  const { document, sharedBy } = accessResult;

  // Determine which renderer to use based on content type
  const renderContent = () => {
    switch (document.contentType) {
      case "procedure":
        return (
          <ProcedureSteps
            document={{
              _id: document._id,
              title: document.title,
              content: document.content,
              contentType: document.contentType,
            }}
          />
        );
      case "checklist":
        return (
          <ChecklistView
            document={{
              _id: document._id,
              title: document.title,
              content: document.content,
              contentType: document.contentType,
            }}
            sessionId={sessionId}
          />
        );
      case "form":
        // For now, render as reference - form rendering would need FormRenderer integration
        return (
          <ReferenceView
            document={{
              _id: document._id,
              title: document.title,
              content: document.content,
              contentType: document.contentType,
            }}
          />
        );
      default:
        // Default to reference view for other content types
        return (
          <ReferenceView
            document={{
              _id: document._id,
              title: document.title,
              content: document.content,
              contentType: document.contentType,
            }}
          />
        );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-background)",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          padding: "var(--space-4) var(--space-6)",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                color: "var(--color-ink-muted)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-wider)",
              }}
            >
              Shared {document.contentType || "Document"}
            </span>
          </div>
          {sharedBy && (
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-ink-light)",
              }}
            >
              Shared by: {sharedBy.name || sharedBy.email}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "var(--space-8) var(--space-6)",
        }}
      >
        {renderContent()}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          padding: "var(--space-4) var(--space-6)",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            color: "var(--color-ink-muted)",
          }}
        >
          Powered by Silver Sycamore Staff Hub
        </span>
      </footer>
    </div>
  );
}
