"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import PageHeader from "@/components/PageHeader";
import { SubmissionViewer } from "@/components/SubmissionViewer";
import { useState } from "react";

export default function FormSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as Id<"formSchemas">;

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<Id<"formSubmissions"> | null>(null);

  const form = useQuery(api.forms.get, { id: formId });
  const submissions = useQuery(api.forms.getSubmissions, { formSchemaId: formId });

  // Format date for display
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (form === undefined) {
    return (
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (form === null) {
    return (
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              marginBottom: "0.5rem",
            }}
          >
            Form not found
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ink-muted)",
            }}
          >
            This form may have been deleted or you don't have access to it.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <PageHeader
        title={`${form.title} - Submissions`}
        description={`View and manage responses for this form.`}
        breadcrumbs={[
          { label: "Forms", href: "/forms" },
          { label: form.title, href: `/forms/${formId}/edit` },
          { label: "Submissions" },
        ]}
        actions={
          <button
            onClick={() => router.push("/forms")}
            style={{
              padding: "0.5rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-ink)",
              background: "transparent",
              border: "1px solid var(--color-border)",
              cursor: "pointer",
            }}
          >
            Back to Forms
          </button>
        }
      />

      {/* Submissions List */}
      {submissions === undefined ? (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
          }}
        >
          Loading submissions...
        </div>
      ) : submissions.length === 0 ? (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              marginBottom: "0.5rem",
            }}
          >
            No submissions yet
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ink-muted)",
            }}
          >
            When people fill out your form, their responses will appear here.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {submissions
            .sort((a, b) => b.submittedAt - a.submittedAt)
            .map((submission) => (
              <div
                key={submission._id}
                onClick={() => setSelectedSubmissionId(submission._id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem 1.25rem",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                  transition: "border-color 150ms ease, background 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                  e.currentTarget.style.background = "var(--color-surface-dim, #F8F8F6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.background = "var(--color-surface)";
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      color: "var(--color-ink)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {submission.respondentName || "Anonymous"}
                  </div>
                  {submission.respondentEmail && (
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      {submission.respondentEmail}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8125rem",
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {formatDate(submission.submittedAt)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSubmissionId(submission._id);
                    }}
                    style={{
                      padding: "0.375rem 0.75rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "var(--color-accent)",
                      background: "rgba(139, 115, 85, 0.1)",
                      border: "1px solid rgba(139, 115, 85, 0.3)",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Submission count */}
      {submissions && submissions.length > 0 && (
        <div
          style={{
            marginTop: "1rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "var(--color-ink-muted)",
            textAlign: "center",
          }}
        >
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Submission Viewer Dialog */}
      {selectedSubmissionId && (
        <SubmissionViewer
          submissionId={selectedSubmissionId}
          formTitle={form.title}
          isOpen={true}
          onClose={() => setSelectedSubmissionId(null)}
          onDeleted={() => {
            // Submissions query will auto-update
          }}
        />
      )}
    </div>
  );
}
