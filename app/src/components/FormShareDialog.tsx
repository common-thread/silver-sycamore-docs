"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { UserPicker } from "./UserPicker";

interface SelectedUser {
  id: Id<"users">;
  email?: string;
  name?: string;
  displayName?: string;
}

interface FormShareDialogProps {
  formId: string; // The form's string formId (not the database _id)
  formSchemaId: Id<"formSchemas">; // The database _id
  formTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FormShareDialog({
  formId,
  formSchemaId,
  formTitle,
  isOpen,
  onClose,
}: FormShareDialogProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [routeToUsers, setRouteToUsers] = useState<SelectedUser[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendForm = useMutation(api.forms.sendForm);
  const sends = useQuery(api.forms.getSends, { formSchemaId });

  // Get IDs of users already added to routing
  const routeToUserIds = routeToUsers.map((u) => u.id);

  // Generate shareable link
  const shareableLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/f/${formId}`
      : `/f/${formId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleAddRouteUser = (user: SelectedUser) => {
    if (!routeToUsers.some((u) => u.id === user.id)) {
      setRouteToUsers([...routeToUsers, user]);
    }
  };

  const handleRemoveRouteUser = (userId: Id<"users">) => {
    setRouteToUsers(routeToUsers.filter((u) => u.id !== userId));
  };

  const handleSendEmail = async () => {
    if (!recipientEmail.trim()) {
      setError("Recipient email is required");
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      // Create send record
      await sendForm({
        formSchemaId,
        recipientEmail: recipientEmail.trim(),
        recipientName: recipientName.trim() || undefined,
        routeToUserIds,
      });

      // Prepare email content
      const subject = encodeURIComponent(`Please complete: ${formTitle}`);
      const bodyLines = [
        recipientName ? `Hi ${recipientName},` : "Hello,",
        "",
        `You've been invited to complete a form: ${formTitle}`,
        "",
        `Please click the link below to fill out the form:`,
        shareableLink,
        "",
        "Thank you!",
      ];
      const body = encodeURIComponent(bodyLines.join("\n"));

      // Open email client
      window.open(`mailto:${recipientEmail.trim()}?subject=${subject}&body=${body}`);

      // Also copy email body to clipboard as fallback
      const emailText = bodyLines.join("\n");
      await navigator.clipboard.writeText(emailText);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);

      // Reset form
      setRecipientEmail("");
      setRecipientName("");
      setRouteToUsers([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send form");
    } finally {
      setIsSending(false);
    }
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
          maxWidth: "520px",
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
            Share Form
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
        <div style={{ padding: "1.5rem" }}>
          {/* Shareable Link Section */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                margin: "0 0 0.5rem 0",
              }}
            >
              Shareable Link
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "var(--color-ink-muted)",
                margin: "0 0 0.75rem 0",
              }}
            >
              Anyone with this link can fill out the form.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <input
                type="text"
                value={shareableLink}
                readOnly
                style={{
                  flex: 1,
                  padding: "0.625rem 0.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  color: "var(--color-ink)",
                  background: "var(--color-surface-dim, #F8F8F6)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 0,
                }}
              />
              <button
                onClick={handleCopyLink}
                style={{
                  padding: "0.625rem 1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: copiedLink ? "#16a34a" : "var(--color-ink)",
                  background: copiedLink ? "rgba(22, 163, 74, 0.1)" : "var(--color-surface)",
                  border: `1px solid ${copiedLink ? "rgba(22, 163, 74, 0.3)" : "var(--color-border)"}`,
                  borderRadius: 0,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {copiedLink ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              margin: "1.5rem 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--color-ink-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              OR
            </span>
            <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
          </div>

          {/* Send via Email Section */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                margin: "0 0 0.75rem 0",
              }}
            >
              Send via Email
            </h3>

            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "var(--color-ink-light)",
                  marginBottom: "0.25rem",
                }}
              >
                Recipient Email *
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="client@example.com"
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--color-ink)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 0,
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "var(--color-ink-light)",
                  marginBottom: "0.25rem",
                }}
              >
                Recipient Name (optional)
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="John Smith"
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--color-ink)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 0,
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Response Routing Section */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                margin: "0 0 0.25rem 0",
              }}
            >
              Response Routing
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--color-ink-muted)",
                margin: "0 0 0.75rem 0",
              }}
            >
              Responses will be sent to you. Add additional recipients below:
            </p>

            <UserPicker
              onSelect={handleAddRouteUser}
              excludeIds={routeToUserIds}
              placeholder="Add team member..."
            />

            {/* Selected routing users */}
            {routeToUsers.length > 0 && (
              <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                {routeToUsers.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.5rem 0.75rem",
                      background: "var(--color-surface-dim, #F8F8F6)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.8125rem",
                          fontWeight: 500,
                          color: "var(--color-ink)",
                        }}
                      >
                        {user.displayName || user.name || user.email}
                      </div>
                      {(user.displayName || user.name) && user.email && (
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.75rem",
                            color: "var(--color-ink-muted)",
                          }}
                        >
                          {user.email}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveRouteUser(user.id)}
                      style={{
                        padding: "0.25rem",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4 4L12 12M12 4L4 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem",
                background: "rgba(199, 80, 80, 0.1)",
                border: "1px solid rgba(199, 80, 80, 0.2)",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "#C75050",
              }}
            >
              {error}
            </div>
          )}

          {/* Copied email confirmation */}
          {copiedEmail && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem",
                background: "rgba(22, 163, 74, 0.1)",
                border: "1px solid rgba(22, 163, 74, 0.2)",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "#16a34a",
              }}
            >
              Email body copied to clipboard as backup!
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            padding: "1rem 1.5rem",
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-surface-dim, #F8F8F6)",
          }}
        >
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
              borderRadius: 0,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmail}
            disabled={isSending || !recipientEmail.trim()}
            style={{
              padding: "0.625rem 1.25rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--color-surface)",
              background: recipientEmail.trim() ? "var(--color-accent)" : "var(--color-ink-muted)",
              border: "none",
              borderRadius: 0,
              cursor: recipientEmail.trim() ? "pointer" : "not-allowed",
              opacity: isSending ? 0.7 : 1,
            }}
          >
            {isSending ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
