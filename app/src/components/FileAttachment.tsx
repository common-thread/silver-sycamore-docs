"use client";

import { useState } from "react";

interface FileAttachmentProps {
  file: {
    name: string;
    mimeType: string;
    size: number;
    url: string | null;
  };
}

// Format file size to human-readable string
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Get file extension from name
function getFileExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "";
}

// Check if mime type is an image
function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

// Check if mime type is a PDF
function isPdf(mimeType: string): boolean {
  return mimeType === "application/pdf";
}

export function FileAttachment({ file }: FileAttachmentProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!file.url) {
    return null;
  }

  const extension = getFileExtension(file.name);

  // Image files - show inline preview
  if (isImage(file.mimeType) && !imageError) {
    return (
      <div
        style={{
          marginTop: "0.5rem",
        }}
      >
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            textDecoration: "none",
          }}
        >
          <img
            src={file.url}
            alt={file.name}
            onError={() => setImageError(true)}
            style={{
              maxWidth: "300px",
              maxHeight: "200px",
              borderRadius: "4px",
              border: "1px solid var(--color-border)",
              cursor: "pointer",
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </a>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--color-ink-muted)",
            marginTop: "0.25rem",
          }}
        >
          {file.name} ({formatFileSize(file.size)})
        </div>
      </div>
    );
  }

  // Non-image files - show card with icon
  return (
    <a
      href={file.url}
      target={isPdf(file.mimeType) ? "_blank" : undefined}
      download={!isPdf(file.mimeType) ? file.name : undefined}
      rel={isPdf(file.mimeType) ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
        marginTop: "0.5rem",
        padding: "0.75rem",
        background: isHovered ? "var(--color-surface-dim, #F8F8F6)" : "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "4px",
        textDecoration: "none",
        transition: "background 0.15s ease, border-color 0.15s ease",
        borderColor: isHovered ? "var(--color-accent)" : "var(--color-border)",
        maxWidth: "300px",
      }}
    >
      {/* File icon */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "4px",
          background: "var(--color-accent-light, #F5F0E8)",
          color: "var(--color-accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {isPdf(file.mimeType) ? (
          // PDF icon
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M11.6667 1.66667H5.00001C4.55798 1.66667 4.13406 1.84227 3.82149 2.15483C3.50893 2.46739 3.33334 2.89131 3.33334 3.33334V16.6667C3.33334 17.1087 3.50893 17.5326 3.82149 17.8452C4.13406 18.1577 4.55798 18.3333 5.00001 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66667L11.6667 1.66667Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.6667 1.66667V6.66667H16.6667"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 10H14M6 13H14"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // Generic file icon
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M11.6667 1.66667H5.00001C4.55798 1.66667 4.13406 1.84227 3.82149 2.15483C3.50893 2.46739 3.33334 2.89131 3.33334 3.33334V16.6667C3.33334 17.1087 3.50893 17.5326 3.82149 17.8452C4.13406 18.1577 4.55798 18.3333 5.00001 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66667L11.6667 1.66667Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.6667 1.66667V6.66667H16.6667"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {/* Extension badge */}
        {extension && (
          <span
            style={{
              position: "absolute",
              bottom: "-2px",
              right: "-2px",
              fontSize: "0.5625rem",
              fontWeight: 600,
              color: "var(--color-surface)",
              background: "var(--color-accent)",
              padding: "0 3px",
              borderRadius: "2px",
              lineHeight: 1.4,
            }}
          >
            {extension}
          </span>
        )}
      </div>

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
          {file.name}
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
          {formatFileSize(file.size)}
          <span style={{ color: "var(--color-accent)" }}>
            {isPdf(file.mimeType) ? "View" : "Download"}
          </span>
        </div>
      </div>

      {/* Download/View icon on hover */}
      <div
        style={{
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.15s ease",
          color: "var(--color-accent)",
        }}
      >
        {isPdf(file.mimeType) ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M15.75 11.25V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V11.25"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.25 7.5L9 11.25L12.75 7.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 11.25V2.25"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M15.75 11.25V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V11.25"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.25 7.5L9 11.25L12.75 7.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 11.25V2.25"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </a>
  );
}
