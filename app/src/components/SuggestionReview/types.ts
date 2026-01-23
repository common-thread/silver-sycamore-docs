import { Id } from "../../../convex/_generated/dataModel";

export interface Suggestion {
  _id: Id<"suggestions">;
  documentId: Id<"documents">;
  authorId: Id<"users">;
  status: "draft" | "pending" | "approved" | "rejected";
  title: string;
  content: string;
  changeNote: string;
  createdAt: number;
  updatedAt: number;
  reviewedBy?: Id<"users">;
  reviewNote?: string;
  appliedAt?: number;
  // Enriched fields
  author: { _id: Id<"users">; name: string; email: string } | null;
  authorDisplayName: string;
  reviewer: { _id: Id<"users">; name: string; email: string } | null;
  reviewerDisplayName: string | null;
  documentTitle: string;
  documentSlug: string | null;
  documentContent: string | null;
}

export type ViewMode = "suggestion" | "compare";

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
