"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { MentionInput } from "./MentionInput";

interface MessageInputProps {
  channelId: Id<"channels">;
  channelName?: string;
  parentId?: Id<"messages">;
  placeholder?: string;
  onSent?: () => void;
}

export function MessageInput({
  channelId,
  channelName,
  parentId,
  placeholder,
  onSent,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useMutation(api.messages.sendMessage);

  const handleSend = useCallback(async () => {
    if (!content.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage({
        channelId,
        content: content.trim(),
        parentId,
      });
      setContent("");
      onSent?.();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  }, [content, channelId, parentId, sendMessage, onSent, isSending]);

  const defaultPlaceholder = channelName
    ? `Message #${channelName}`
    : parentId
    ? "Reply in thread..."
    : "Write a message...";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {/* MentionInput with Enter-to-send support */}
      <MentionInput
        value={content}
        onChange={setContent}
        placeholder={placeholder ?? defaultPlaceholder}
        rows={2}
        onSubmit={handleSend}
      />

      {/* Actions row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side - attachment placeholder */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            disabled
            title="Attachments coming soon"
            style={{
              padding: "0.5rem",
              background: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: "4px",
              cursor: "not-allowed",
              opacity: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M15.75 9.75V9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9V14.25C2.25 14.6642 2.58579 15 3 15H9"
                stroke="var(--color-ink-muted)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M11.25 15.75L15.75 11.25"
                stroke="var(--color-ink-muted)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M15.75 15.75V11.25H11.25"
                stroke="var(--color-ink-muted)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--color-ink-muted)",
            }}
          >
            Shift+Enter for new line
          </span>
        </div>

        {/* Right side - send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          style={{
            padding: "0.5rem 1rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--color-surface)",
            background: "var(--color-accent)",
            border: "none",
            borderRadius: "4px",
            cursor: !content.trim() || isSending ? "not-allowed" : "pointer",
            opacity: !content.trim() || isSending ? 0.5 : 1,
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (content.trim() && !isSending) {
              e.currentTarget.style.background = "var(--color-accent-hover)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-accent)";
          }}
        >
          {isSending ? (
            "Sending..."
          ) : (
            <>
              Send
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 8L2 14V8.5L8 8L2 7.5V2L14 8Z"
                  fill="currentColor"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
