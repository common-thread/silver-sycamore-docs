"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { CommentItem } from "./CommentItem";
import { MentionInput } from "./MentionInput";
import { usePermissions } from "@/hooks/usePermissions";

interface CommentSectionProps {
  documentId?: Id<"documents">;
  personalDocumentId?: Id<"personalDocuments">;
}

export function CommentSection({
  documentId,
  personalDocumentId,
}: CommentSectionProps) {
  const { user, role } = usePermissions();

  // Fetch comments based on document type
  const wikiComments = useQuery(
    api.comments.getByDocument,
    documentId ? { documentId } : "skip"
  );
  const personalComments = useQuery(
    api.comments.getByPersonalDocument,
    personalDocumentId ? { personalDocumentId } : "skip"
  );

  const comments = documentId ? wikiComments : personalComments;

  const addComment = useMutation(api.comments.add);

  const [newCommentContent, setNewCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<Id<"comments"> | undefined>();
  const [replyContent, setReplyContent] = useState("");

  // Get top-level comments (no parentId)
  const topLevelComments = comments?.filter((c) => !c.parentId) ?? [];
  const commentCount = comments?.length ?? 0;

  const handleSubmitComment = async () => {
    if (!newCommentContent.trim()) return;
    setIsSubmitting(true);
    try {
      await addComment({
        documentId,
        personalDocumentId,
        content: newCommentContent,
      });
      setNewCommentContent("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (parentId: Id<"comments">) => {
    setActiveReplyId(parentId);
    setReplyContent("");
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !activeReplyId) return;
    setIsSubmitting(true);
    try {
      await addComment({
        documentId,
        personalDocumentId,
        parentId: activeReplyId,
        content: replyContent,
      });
      setActiveReplyId(undefined);
      setReplyContent("");
    } catch (error) {
      console.error("Failed to add reply:", error);
      alert("Failed to add reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReply = () => {
    setActiveReplyId(undefined);
    setReplyContent("");
  };

  // Loading state
  if (comments === undefined) {
    return (
      <div
        style={{
          padding: "1.5rem 0",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-muted)",
        }}
      >
        Loading comments...
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem 0" }}>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
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
          Discussion
        </h2>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "var(--color-ink-muted)",
          }}
        >
          {commentCount === 0
            ? "No comments yet"
            : `${commentCount} Comment${commentCount !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Comment list */}
      {topLevelComments.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {topLevelComments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              allComments={comments}
              currentUserId={user?.id}
              userRole={role}
              onReply={handleReply}
              activeReplyId={activeReplyId}
              replyContent={replyContent}
              onReplyContentChange={setReplyContent}
              onSubmitReply={handleSubmitReply}
              onCancelReply={handleCancelReply}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}

      {/* Add comment form */}
      <div
        style={{
          padding: "1rem",
          background: "var(--color-surface-dim)",
          borderRadius: "4px",
          border: "1px solid var(--color-border)",
        }}
      >
        <MentionInput
          value={newCommentContent}
          onChange={setNewCommentContent}
          placeholder="Add a comment... Use @ to mention someone"
          rows={4}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "0.75rem",
          }}
        >
          <button
            onClick={handleSubmitComment}
            disabled={isSubmitting || !newCommentContent.trim()}
            style={{
              padding: "0.5rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-surface)",
              background: "var(--color-accent)",
              border: "none",
              borderRadius: "2px",
              cursor: isSubmitting || !newCommentContent.trim() ? "not-allowed" : "pointer",
              opacity: isSubmitting || !newCommentContent.trim() ? 0.6 : 1,
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting && newCommentContent.trim()) {
                e.currentTarget.style.background = "var(--color-accent-hover)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-accent)";
            }}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}
