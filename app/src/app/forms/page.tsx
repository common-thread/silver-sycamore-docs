"use client";

import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/ui/Button";
import { FormShareDialog } from "@/components/FormShareDialog";
import { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";

export default function FormsPage() {
  const router = useRouter();
  const forms = useQuery(api.forms.list);
  const publishForm = useMutation(api.forms.publish);
  const unpublishForm = useMutation(api.forms.unpublish);
  const deleteForm = useMutation(api.forms.remove);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [shareDialogForm, setShareDialogForm] = useState<{
    formId: string;
    formSchemaId: Id<"formSchemas">;
    title: string;
  } | null>(null);

  const handlePublish = async (id: Id<"formSchemas">) => {
    setActionLoading(id);
    try {
      await publishForm({ id });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnpublish = async (id: Id<"formSchemas">) => {
    setActionLoading(id);
    try {
      await unpublishForm({ id });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: Id<"formSchemas">) => {
    if (!confirm("Are you sure you want to delete this form? This will also delete all submissions.")) {
      return;
    }
    setActionLoading(id);
    try {
      await deleteForm({ id });
    } finally {
      setActionLoading(null);
    }
  };

  // Parse fields from JSON to get count
  const getFieldCount = (fieldsJson: string): number => {
    try {
      const fields = JSON.parse(fieldsJson);
      return Array.isArray(fields) ? fields.length : 0;
    } catch {
      return 0;
    }
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <PageHeader
        title="Forms"
        description="Create and manage forms for client intake, feedback, and event planning."
        breadcrumbs={[{ label: "Forms" }]}
        actions={
          <Button onClick={() => router.push("/forms/new")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3V13M3 8H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            New Form
          </Button>
        }
      />

      {/* Forms List */}
      {forms === undefined ? (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
          }}
        >
          Loading forms...
        </div>
      ) : forms.length === 0 ? (
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
            No forms yet
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ink-muted)",
              marginBottom: "1.5rem",
            }}
          >
            Create your first form to start collecting responses.
          </div>
          <Button onClick={() => router.push("/forms/new")}>Create Form</Button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {forms.map((form) => (
            <div
              key={form._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.25rem 1.5rem",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                transition: "border-color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            >
              {/* Form info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.375rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.0625rem",
                      fontWeight: 600,
                      color: "var(--color-ink)",
                      margin: 0,
                    }}
                  >
                    {form.title}
                  </h3>
                  <span
                    style={{
                      padding: "0.125rem 0.5rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.6875rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                      borderRadius: "2px",
                      ...(form.isPublished
                        ? {
                            background: "rgba(22, 163, 74, 0.1)",
                            color: "#16a34a",
                          }
                        : {
                            background: "var(--color-surface-dim, #F8F8F6)",
                            color: "var(--color-ink-muted)",
                          }),
                    }}
                  >
                    {form.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--color-ink-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <span>{getFieldCount(form.fields)} fields</span>
                  <span style={{ color: "var(--color-border)" }}>|</span>
                  <span style={{ textTransform: "capitalize" }}>{form.category.replace(/_/g, " ")}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {form.isPublished ? (
                  <>
                    <button
                      onClick={() =>
                        setShareDialogForm({
                          formId: form.formId,
                          formSchemaId: form._id,
                          title: form.title,
                        })
                      }
                      style={{
                        padding: "0.5rem 0.875rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        color: "var(--color-accent)",
                        background: "rgba(139, 115, 85, 0.1)",
                        border: "1px solid rgba(139, 115, 85, 0.3)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M10.5 5.25L10.5 3.5C10.5 2.67157 9.82843 2 9 2L5 2C4.17157 2 3.5 2.67157 3.5 3.5L3.5 5.25M7 8.75L7 2M7 8.75L9 6.75M7 8.75L5 6.75M2.625 12L11.375 12C11.7202 12 12 11.7202 12 11.375L12 8.625C12 8.27982 11.7202 8 11.375 8L2.625 8C2.27982 8 2 8.27982 2 8.625L2 11.375C2 11.7202 2.27982 12 2.625 12Z"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Share
                    </button>
                    <button
                      onClick={() => handleUnpublish(form._id)}
                      disabled={actionLoading === form._id}
                      style={{
                        padding: "0.5rem 0.875rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        color: "var(--color-ink-light)",
                        background: "transparent",
                        border: "1px solid var(--color-border)",
                        cursor: actionLoading === form._id ? "not-allowed" : "pointer",
                        opacity: actionLoading === form._id ? 0.6 : 1,
                      }}
                    >
                      Unpublish
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handlePublish(form._id)}
                    disabled={actionLoading === form._id}
                    style={{
                      padding: "0.5rem 0.875rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: "#16a34a",
                      background: "rgba(22, 163, 74, 0.1)",
                      border: "1px solid rgba(22, 163, 74, 0.3)",
                      cursor: actionLoading === form._id ? "not-allowed" : "pointer",
                      opacity: actionLoading === form._id ? 0.6 : 1,
                    }}
                  >
                    Publish
                  </button>
                )}
                <button
                  onClick={() => router.push(`/forms/${form._id}/edit`)}
                  style={{
                    padding: "0.5rem 0.875rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--color-ink-light)",
                    background: "transparent",
                    border: "1px solid var(--color-border)",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(form._id)}
                  disabled={actionLoading === form._id}
                  style={{
                    padding: "0.5rem",
                    background: "transparent",
                    border: "none",
                    cursor: actionLoading === form._id ? "not-allowed" : "pointer",
                    color: "#C75050",
                    opacity: actionLoading === form._id ? 0.6 : 1,
                  }}
                  title="Delete form"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 4H13M6 4V3C6 2.44772 6.44772 2 7 2H9C9.55228 2 10 2.44772 10 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Dialog */}
      {shareDialogForm && (
        <FormShareDialog
          formId={shareDialogForm.formId}
          formSchemaId={shareDialogForm.formSchemaId}
          formTitle={shareDialogForm.title}
          isOpen={true}
          onClose={() => setShareDialogForm(null)}
        />
      )}
    </div>
  );
}
