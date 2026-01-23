"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export interface Feedback {
  type: "success" | "error";
  message: string;
}

export interface UseSuggestionActionsReturn {
  isSubmitting: boolean;
  feedback: Feedback | null;
  setFeedback: (feedback: Feedback | null) => void;
  handleApprove: (suggestionId: Id<"suggestions">, reviewNote?: string) => Promise<boolean>;
  handleReject: (suggestionId: Id<"suggestions">, reviewNote: string) => Promise<boolean>;
  handlePromote: (suggestionId: Id<"suggestions">) => Promise<boolean>;
}

export function useSuggestionActions(): UseSuggestionActionsReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const approveMutation = useMutation(api.suggestions.approve);
  const rejectMutation = useMutation(api.suggestions.reject);
  const promoteMutation = useMutation(api.suggestions.promote);

  const handleApprove = useCallback(
    async (suggestionId: Id<"suggestions">, reviewNote?: string): Promise<boolean> => {
      setIsSubmitting(true);
      setFeedback(null);
      try {
        await approveMutation({
          id: suggestionId,
          reviewNote: reviewNote?.trim() || undefined,
        });
        setFeedback({ type: "success", message: "Suggestion approved successfully" });
        return true;
      } catch (error) {
        console.error("Failed to approve:", error);
        setFeedback({ type: "error", message: "Failed to approve suggestion. Please try again." });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [approveMutation]
  );

  const handleReject = useCallback(
    async (suggestionId: Id<"suggestions">, reviewNote: string): Promise<boolean> => {
      if (!reviewNote.trim()) {
        setFeedback({ type: "error", message: "Please provide a reason for rejection" });
        return false;
      }
      setIsSubmitting(true);
      setFeedback(null);
      try {
        await rejectMutation({
          id: suggestionId,
          reviewNote: reviewNote.trim(),
        });
        setFeedback({ type: "success", message: "Suggestion rejected" });
        return true;
      } catch (error) {
        console.error("Failed to reject:", error);
        setFeedback({ type: "error", message: "Failed to reject suggestion. Please try again." });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [rejectMutation]
  );

  const handlePromote = useCallback(
    async (suggestionId: Id<"suggestions">): Promise<boolean> => {
      setIsSubmitting(true);
      setFeedback(null);
      try {
        await promoteMutation({ id: suggestionId });
        setFeedback({ type: "success", message: "Changes applied to document successfully" });
        return true;
      } catch (error) {
        console.error("Failed to promote:", error);
        setFeedback({ type: "error", message: "Failed to apply changes. Please try again." });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [promoteMutation]
  );

  return {
    isSubmitting,
    feedback,
    setFeedback,
    handleApprove,
    handleReject,
    handlePromote,
  };
}
