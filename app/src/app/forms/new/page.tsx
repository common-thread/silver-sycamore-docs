"use client";

import PageHeader from "@/components/PageHeader";
import { FormBuilder } from "@/components/FormBuilder";

export default function NewFormPage() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <PageHeader
        title="New Form"
        description="Create a new form to collect responses from clients or staff."
        breadcrumbs={[
          { label: "Forms", href: "/forms" },
          { label: "New Form" },
        ]}
      />

      <FormBuilder />
    </div>
  );
}
