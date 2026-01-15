"use client";

import { useState, useCallback, useRef } from "react";
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

// Format file size to human-readable string
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Accepted file types
const ACCEPTED_FILE_TYPES = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function MessageInput({
  channelId,
  channelName,
  parentId,
  placeholder,
  onSent,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedStorageId, setUploadedStorageId] = useState<Id<"_storage"> | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = useMutation(api.messages.sendMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input for re-selection of same file
    e.target.value = "";

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`);
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
    setIsUploading(true);

    try {
      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Upload the file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();
      setUploadedStorageId(storageId);
    } catch (error) {
      console.error("Failed to upload file:", error);
      setUploadError("Failed to upload file. Please try again.");
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadedStorageId(null);
    setUploadError(null);
  };

  const handleSend = useCallback(async () => {
    // Allow send if there's content OR a file
    if ((!content.trim() && !uploadedStorageId) || isSending || isUploading) return;

    setIsSending(true);
    try {
      await sendMessage({
        channelId,
        content: content.trim(),
        parentId,
        storageId: uploadedStorageId ?? undefined,
        fileName: selectedFile?.name,
        fileMimeType: selectedFile?.type,
        fileSize: selectedFile?.size,
      });
      setContent("");
      setSelectedFile(null);
      setUploadedStorageId(null);
      onSent?.();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  }, [content, channelId, parentId, sendMessage, onSent, isSending, isUploading, uploadedStorageId, selectedFile]);

  const defaultPlaceholder = channelName
    ? `Message #${channelName}`
    : parentId
    ? "Reply in thread..."
    : "Write a message...";

  const canSend = (content.trim() || uploadedStorageId) && !isSending && !isUploading;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {/* File preview */}
      {selectedFile && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem",
            background: "var(--color-surface-dim, #F8F8F6)",
            border: "1px solid var(--color-border)",
            borderRadius: "4px",
          }}
        >
          {/* File icon or preview */}
          {selectedFile.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt={selectedFile.name}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "4px",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "4px",
                background: "var(--color-accent-light, #F5F0E8)",
                color: "var(--color-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2V8H20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          {/* File info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--color-ink)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selectedFile.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--color-ink-muted)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {formatFileSize(selectedFile.size)}
              {isUploading && (
                <span style={{ color: "var(--color-accent)" }}>Uploading...</span>
              )}
              {uploadedStorageId && (
                <span style={{ color: "var(--color-success, #22c55e)" }}>Ready</span>
              )}
            </div>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemoveFile}
            disabled={isUploading}
            style={{
              padding: "0.375rem",
              background: "transparent",
              border: "none",
              cursor: isUploading ? "not-allowed" : "pointer",
              opacity: isUploading ? 0.5 : 1,
              color: "var(--color-ink-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Remove file"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Upload error */}
      {uploadError && (
        <div
          style={{
            padding: "0.5rem 0.75rem",
            background: "var(--color-error-light, #FEF2F2)",
            border: "1px solid var(--color-error, #EF4444)",
            borderRadius: "4px",
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "var(--color-error, #EF4444)",
          }}
        >
          {uploadError}
        </div>
      )}

      {/* MentionInput with Enter-to-send support */}
      <MentionInput
        value={content}
        onChange={setContent}
        placeholder={placeholder ?? defaultPlaceholder}
        rows={2}
        onSubmit={handleSend}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {/* Actions row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side - attachment button */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !!selectedFile}
            title={selectedFile ? "File already selected" : "Attach file"}
            style={{
              padding: "0.5rem",
              background: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: "4px",
              cursor: isUploading || selectedFile ? "not-allowed" : "pointer",
              opacity: isUploading || selectedFile ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "border-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isUploading && !selectedFile) {
                e.currentTarget.style.borderColor = "var(--color-accent)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M15.75 8.625L9.28033 15.0947C8.43241 15.9426 7.27739 16.4172 6.07296 16.4172C4.86852 16.4172 3.7135 15.9426 2.86559 15.0947C2.01768 14.2468 1.54305 13.0918 1.54305 11.8873C1.54305 10.6829 2.01768 9.52786 2.86559 8.67995L9.33526 2.21028C9.90121 1.64433 10.672 1.32617 11.4762 1.32617C12.2804 1.32617 13.0512 1.64433 13.6171 2.21028C14.1831 2.77623 14.5013 3.54701 14.5013 4.35124C14.5013 5.15547 14.1831 5.92625 13.6171 6.4922L7.14745 12.9619C6.86447 13.2449 6.47908 13.4039 6.07696 13.4039C5.67485 13.4039 5.28946 13.2449 5.00648 12.9619C4.7235 12.6789 4.56442 12.2935 4.56442 11.8914C4.56442 11.4893 4.7235 11.1039 5.00648 10.8209L10.9215 4.90594"
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
          disabled={!canSend}
          style={{
            padding: "0.5rem 1rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--color-surface)",
            background: "var(--color-accent)",
            border: "none",
            borderRadius: "4px",
            cursor: !canSend ? "not-allowed" : "pointer",
            opacity: !canSend ? 0.5 : 1,
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (canSend) {
              e.currentTarget.style.background = "var(--color-accent-hover)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-accent)";
          }}
        >
          {isSending ? (
            "Sending..."
          ) : isUploading ? (
            "Uploading..."
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
