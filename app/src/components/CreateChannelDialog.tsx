"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";

interface CreateChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateChannelDialog({ isOpen, onClose }: CreateChannelDialogProps) {
  const router = useRouter();
  const createChannel = useMutation(api.channels.createChannel);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"public" | "private">("public");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Channel name is required");
      return;
    }

    setIsCreating(true);
    try {
      const result = await createChannel({
        name: name.trim(),
        type,
        description: description.trim() || undefined,
      });

      // Navigate to the new channel
      router.push(`/messages/${result.channelId}`);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to create channel");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setType("public");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(20, 20, 20, 0.5)",
        }}
      />

      {/* Dialog */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          margin: "1rem",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 8px 32px rgba(20, 20, 20, 0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            Create Channel
          </h2>
          <button
            onClick={handleClose}
            style={{
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--color-ink-muted)",
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: "1.5rem" }}>
            {/* Name field */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                htmlFor="channel-name"
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-ink-light)",
                  marginBottom: "0.5rem",
                }}
              >
                Channel Name
              </label>
              <input
                id="channel-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., general, announcements"
                autoFocus
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                  color: "var(--color-ink)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 0,
                  outline: "none",
                  transition: "border-color 150ms ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              />
            </div>

            {/* Description field */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                htmlFor="channel-description"
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-ink-light)",
                  marginBottom: "0.5rem",
                }}
              >
                Description{" "}
                <span style={{ fontWeight: 400, color: "var(--color-ink-muted)" }}>
                  (optional)
                </span>
              </label>
              <textarea
                id="channel-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this channel about?"
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                  color: "var(--color-ink)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 0,
                  outline: "none",
                  resize: "vertical",
                  transition: "border-color 150ms ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              />
            </div>

            {/* Type selection */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-ink-light)",
                  marginBottom: "0.75rem",
                }}
              >
                Channel Type
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    background:
                      type === "public"
                        ? "var(--color-surface-dim, #F8F8F6)"
                        : "transparent",
                    border: `1px solid ${type === "public" ? "var(--color-accent)" : "var(--color-border)"}`,
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                >
                  <input
                    type="radio"
                    name="channel-type"
                    value="public"
                    checked={type === "public"}
                    onChange={() => setType("public")}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginTop: "2px",
                      accentColor: "var(--color-accent)",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9375rem",
                        fontWeight: 500,
                        color: "var(--color-ink)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Public
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      Anyone can join this channel
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    background:
                      type === "private"
                        ? "var(--color-surface-dim, #F8F8F6)"
                        : "transparent",
                    border: `1px solid ${type === "private" ? "var(--color-accent)" : "var(--color-border)"}`,
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                >
                  <input
                    type="radio"
                    name="channel-type"
                    value="private"
                    checked={type === "private"}
                    onChange={() => setType("private")}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginTop: "2px",
                      accentColor: "var(--color-accent)",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9375rem",
                        fontWeight: 500,
                        color: "var(--color-ink)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Private
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      Only invited members can see and join
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  marginBottom: "1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  color: "#C75050",
                  background: "rgba(199, 80, 80, 0.1)",
                  border: "1px solid rgba(199, 80, 80, 0.3)",
                }}
              >
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid var(--color-border)",
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
            }}
          >
            <button
              type="button"
              onClick={handleClose}
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
                transition: "all 150ms ease",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !name.trim()}
              style={{
                padding: "0.625rem 1.25rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--color-surface)",
                background:
                  isCreating || !name.trim()
                    ? "var(--color-ink-muted)"
                    : "var(--color-accent)",
                border: "none",
                borderRadius: 0,
                cursor: isCreating || !name.trim() ? "not-allowed" : "pointer",
                opacity: isCreating || !name.trim() ? 0.6 : 1,
                transition: "all 150ms ease",
              }}
            >
              {isCreating ? "Creating..." : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
