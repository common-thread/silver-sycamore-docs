"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface Author {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

interface Comment {
  _id: Id<"comments">;
  content: string;
  createdAt: number;
  updatedAt: number;
  parentId?: Id<"comments">;
  author: Author;
}

interface CommentItemProps {
  comment: Comment;
  allComments: Comment[];
  currentUserId?: string;
  userRole?: string;
  onReply: (parentId: Id<"comments">) => void;
  activeReplyId?: Id<"comments">;
  replyContent: string;
  onReplyContentChange: (content: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
  isSubmitting: boolean;
  depth?: number;
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function CommentItem({
  comment,
  allComments,
  currentUserId,
  userRole,
  onReply,
  activeReplyId,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
  onCancelReply,
  isSubmitting,
  depth = 0,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateComment = useMutation(api.comments.update);
  const deleteComment = useMutation(api.comments.remove);

  const isAuthor = currentUserId === comment.author.id;
  const isPrivileged = userRole === "admin" || userRole === "manager";
  const canEdit = isAuthor;
  const canDelete = isAuthor || isPrivileged;

  // Get direct replies to this comment
  const replies = allComments.filter((c) => c.parentId === comment._id);
  const hasReplies = replies.length > 0;
  const showCollapseToggle = replies.length > 2;

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    setIsUpdating(true);
    try {
      await updateComment({
        commentId: comment._id,
        content: editContent,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    setIsDeleting(true);
    try {
      await deleteComment({ commentId: comment._id });
    } catch (error) {
      console.error("Failed to delete comment:", error);
      setIsDeleting(false);
    }
  };

  const wasEdited = comment.updatedAt > comment.createdAt + 1000;

  return (
    <div
      style={{
        marginLeft: depth > 0 ? "1.5rem" : 0,
        borderLeft: depth > 0 ? "1px solid var(--color-border)" : "none",
        paddingLeft: depth > 0 ? "1rem" : 0,
      }}
    >
      {/* Comment header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
          marginBottom: "0.5rem",
        }}
      >
        {/* Avatar */}
        {comment.author.avatarUrl ? (
          <img
            src={comment.author.avatarUrl}
            alt={comment.author.displayName}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--color-accent-light)",
              color: "var(--color-accent-hover)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {getInitials(comment.author.displayName)}
          </div>
        )}

        {/* Content area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Author + timestamp row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.25rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-ink)",
              }}
            >
              {comment.author.displayName}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--color-ink-muted)",
              }}
            >
              {formatRelativeTime(comment.createdAt)}
              {wasEdited && " (edited)"}
            </span>
          </div>

          {/* Comment body */}
          {isEditing ? (
            <div style={{ marginBottom: "0.5rem" }}>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "80px",
                  padding: "0.5rem 0.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--color-ink)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "4px",
                  resize: "vertical",
                  lineHeight: 1.5,
                }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  onClick={handleEdit}
                  disabled={isUpdating || !editContent.trim()}
                  style={{
                    padding: "0.375rem 0.75rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--color-surface)",
                    background: "var(--color-accent)",
                    border: "none",
                    borderRadius: "2px",
                    cursor: isUpdating ? "not-allowed" : "pointer",
                    opacity: isUpdating || !editContent.trim() ? 0.6 : 1,
                  }}
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  disabled={isUpdating}
                  style={{
                    padding: "0.375rem 0.75rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--color-ink-light)",
                    background: "transparent",
                    border: "1px solid var(--color-border)",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--color-ink)",
                lineHeight: 1.6,
                margin: 0,
                marginBottom: "0.5rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {comment.content}
            </p>
          )}

          {/* Actions */}
          {!isEditing && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <button
                onClick={() => onReply(comment._id)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "var(--color-ink-muted)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-ink-muted)";
                }}
              >
                Reply
              </button>
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--color-ink-muted)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-ink-muted)";
                  }}
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--color-ink-muted)",
                    background: "transparent",
                    border: "none",
                    cursor: isDeleting ? "not-allowed" : "pointer",
                    padding: 0,
                    transition: "color 0.15s ease",
                    opacity: isDeleting ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isDeleting) e.currentTarget.style.color = "#c53030";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-ink-muted)";
                  }}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          )}

          {/* Inline reply form */}
          {activeReplyId === comment._id && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.75rem",
                background: "var(--color-surface-dim)",
                borderRadius: "4px",
              }}
            >
              <textarea
                value={replyContent}
                onChange={(e) => onReplyContentChange(e.target.value)}
                placeholder={`Reply to ${comment.author.displayName}...`}
                style={{
                  width: "100%",
                  minHeight: "60px",
                  padding: "0.5rem 0.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--color-ink)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "4px",
                  resize: "vertical",
                  lineHeight: 1.5,
                }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  onClick={onSubmitReply}
                  disabled={isSubmitting || !replyContent.trim()}
                  style={{
                    padding: "0.375rem 0.75rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--color-surface)",
                    background: "var(--color-accent)",
                    border: "none",
                    borderRadius: "2px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting || !replyContent.trim() ? 0.6 : 1,
                  }}
                >
                  {isSubmitting ? "Posting..." : "Reply"}
                </button>
                <button
                  onClick={onCancelReply}
                  disabled={isSubmitting}
                  style={{
                    padding: "0.375rem 0.75rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--color-ink-light)",
                    background: "transparent",
                    border: "1px solid var(--color-border)",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies section */}
      {hasReplies && (
        <div style={{ marginTop: "0.75rem" }}>
          {showCollapseToggle && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--color-accent)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.25rem 0",
                marginLeft: depth > 0 ? "1.5rem" : 0,
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-accent-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-accent)";
              }}
            >
              {isExpanded
                ? `Hide ${replies.length} replies`
                : `Show ${replies.length} replies`}
            </button>
          )}

          {(isExpanded || !showCollapseToggle) && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: showCollapseToggle ? "0.5rem" : 0,
              }}
            >
              {replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  allComments={allComments}
                  currentUserId={currentUserId}
                  userRole={userRole}
                  onReply={onReply}
                  activeReplyId={activeReplyId}
                  replyContent={replyContent}
                  onReplyContentChange={onReplyContentChange}
                  onSubmitReply={onSubmitReply}
                  onCancelReply={onCancelReply}
                  isSubmitting={isSubmitting}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
