"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { usePermissions } from "@/hooks/usePermissions";
import { SuggestionHeader } from "./SuggestionHeader";
import { SuggestionContent } from "./SuggestionContent";
import { ReviewActions } from "./ReviewActions";
import { ApproveDialog } from "./ApproveDialog";
import { RejectDialog } from "./RejectDialog";
import { useSuggestionActions } from "./hooks/useSuggestionActions";
import { Suggestion, ViewMode } from "./types";

interface SuggestionReviewProps {
  suggestionId: Id<"suggestions">;
}

export function SuggestionReview({ suggestionId }: SuggestionReviewProps) {
  const { isManager, isLoading: permissionsLoading } = usePermissions();
  const suggestion = useQuery(api.suggestions.getById, { id: suggestionId }) as Suggestion | null | undefined;

  const [viewMode, setViewMode] = useState<ViewMode>("suggestion");
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [reviewNote, setReviewNote] = useState("");

  const { isSubmitting, feedback, handleApprove, handleReject, handlePromote } = useSuggestionActions();

  // Loading state
  if (suggestion === undefined || permissionsLoading) {
    return (
      <div
        style={{
          padding: "2rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-muted)",
          textAlign: "center",
        }}
      >
        Loading suggestion...
      </div>
    );
  }

  // Not found
  if (suggestion === null) {
    return (
      <div
        style={{
          padding: "2rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-muted)",
          textAlign: "center",
        }}
      >
        Suggestion not found
      </div>
    );
  }

  const onApproveConfirm = async () => {
    const success = await handleApprove(suggestionId, reviewNote);
    if (success) {
      setShowApproveDialog(false);
      setReviewNote("");
    }
  };

  const onRejectConfirm = async () => {
    const success = await handleReject(suggestionId, reviewNote);
    if (success) {
      setShowRejectDialog(false);
      setReviewNote("");
    }
  };

  const onPromoteClick = () => {
    handlePromote(suggestionId);
  };

  return (
    <div>
      {/* Feedback message */}
      {feedback && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            background: feedback.type === "success" ? "rgba(21, 128, 61, 0.1)" : "rgba(185, 28, 28, 0.1)",
            color: feedback.type === "success" ? "#15803d" : "#b91c1c",
            border: `1px solid ${feedback.type === "success" ? "rgba(21, 128, 61, 0.2)" : "rgba(185, 28, 28, 0.2)"}`,
          }}
        >
          {feedback.message}
        </div>
      )}

      <SuggestionHeader suggestion={suggestion} />

      <SuggestionContent
        suggestion={suggestion}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <ReviewActions
        suggestion={suggestion}
        isManager={isManager}
        isSubmitting={isSubmitting}
        onApproveClick={() => setShowApproveDialog(true)}
        onRejectClick={() => setShowRejectDialog(true)}
        onPromoteClick={onPromoteClick}
      />

      <ApproveDialog
        isOpen={showApproveDialog}
        isSubmitting={isSubmitting}
        reviewNote={reviewNote}
        onReviewNoteChange={setReviewNote}
        onConfirm={onApproveConfirm}
        onCancel={() => setShowApproveDialog(false)}
      />

      <RejectDialog
        isOpen={showRejectDialog}
        isSubmitting={isSubmitting}
        reviewNote={reviewNote}
        onReviewNoteChange={setReviewNote}
        onConfirm={onRejectConfirm}
        onCancel={() => setShowRejectDialog(false)}
      />
    </div>
  );
}
