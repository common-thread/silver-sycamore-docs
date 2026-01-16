"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import PageHeader from "@/components/PageHeader";
import { FormBuilder } from "@/components/FormBuilder";
import { FormShareDialog } from "@/components/FormShareDialog";

interface EditFormPageProps {
  params: Promise<{ formId: string }>;
}

export default function EditFormPage({ params }: EditFormPageProps) {
  const { formId } = use(params);
  const form = useQuery(api.forms.get, { id: formId as Id<"formSchemas"> });
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Loading state
  if (form === undefined) {
    return (
      <div
        style={{
          maxWidth: "800px",
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
          Loading form...
        </div>
      </div>
    );
  }

  // Not found state
  if (form === null) {
    return (
      <div
        style={{
          maxWidth: "800px",
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
          Form not found
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <PageHeader
        title={`Edit: ${form.title}`}
        description="Update form fields and settings."
        breadcrumbs={[
          { label: "Forms", href: "/forms" },
          { label: form.title },
        ]}
        actions={
          form.isPublished ? (
            <button
              onClick={() => setShowShareDialog(true)}
              style={{
                padding: "0.625rem 1.25rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--color-accent)",
                background: "rgba(139, 115, 85, 0.1)",
                border: "1px solid rgba(139, 115, 85, 0.3)",
                borderRadius: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 6L12 4C12 2.89543 11.1046 2 10 2L6 2C4.89543 2 4 2.89543 4 4L4 6M8 10L8 2M8 10L10.5 7.5M8 10L5.5 7.5M3 14L13 14C13.5523 14 14 13.5523 14 13L14 10C14 9.44772 13.5523 9 13 9L3 9C2.44772 9 2 9.44772 2 10L2 13C2 13.5523 2.44772 14 3 14Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Share Form
            </button>
          ) : (
            <span
              style={{
                padding: "0.625rem 1.25rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--color-ink-muted)",
                background: "var(--color-surface-dim, #F8F8F6)",
                border: "1px solid var(--color-border)",
                borderRadius: 0,
                cursor: "not-allowed",
              }}
              title="Publish form to share"
            >
              Publish to Share
            </span>
          )
        }
      />

      <FormBuilder formId={formId as Id<"formSchemas">} />

      {/* Share Dialog */}
      {showShareDialog && form.isPublished && (
        <FormShareDialog
          formId={form.formId}
          formSchemaId={form._id}
          formTitle={form.title}
          isOpen={true}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </div>
  );
}
