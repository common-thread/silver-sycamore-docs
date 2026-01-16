"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import PageHeader from "@/components/PageHeader";
import { FormBuilder } from "@/components/FormBuilder";

interface EditFormPageProps {
  params: Promise<{ formId: string }>;
}

export default function EditFormPage({ params }: EditFormPageProps) {
  const { formId } = use(params);
  const form = useQuery(api.forms.get, { id: formId as Id<"formSchemas"> });

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
      />

      <FormBuilder formId={formId as Id<"formSchemas">} />
    </div>
  );
}
