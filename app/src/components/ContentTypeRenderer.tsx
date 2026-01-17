"use client";

import { DocumentViewer } from "./DocumentViewer";
import { ProcedureSteps } from "./ProcedureSteps";
import { ChecklistView } from "./ChecklistView";
import Link from "next/link";

interface ContentTypeRendererProps {
  document: {
    _id: string;
    title: string;
    content: string;
    contentType?: "procedure" | "reference" | "form" | "checklist" | "guide";
    sourceType?: string;
    description?: string;
    formId?: string;
  };
  fileUrl?: string;
}

/**
 * FormLink component - links to the form builder form
 */
function FormLink({ formId, documentTitle }: { formId: string; documentTitle: string }) {
  return (
    <div
      style={{
        background: "var(--color-paper-warm)",
        border: "1px solid var(--color-border)",
        borderRadius: "0",
        padding: "var(--space-8)",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-2xl)",
          fontWeight: "var(--font-semibold)",
          marginBottom: "var(--space-4)",
          color: "var(--color-ink)",
        }}
      >
        {documentTitle}
      </h1>
      <p
        style={{
          color: "var(--color-ink-light)",
          marginBottom: "var(--space-6)",
          fontSize: "var(--text-base)",
        }}
      >
        This document is linked to a form in the form builder.
      </p>
      <Link
        href={`/forms/${formId}`}
        style={{
          display: "inline-block",
          background: "var(--color-accent)",
          color: "var(--color-paper-white)",
          padding: "var(--space-3) var(--space-6)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-medium)",
          border: "none",
          borderRadius: "0",
          textDecoration: "none",
          transition: "background var(--duration-normal) var(--ease-default)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--color-accent-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--color-accent)";
        }}
      >
        Open Form
      </Link>
    </div>
  );
}

/**
 * ContentTypeRenderer - routes documents to type-specific renderers based on contentType.
 *
 * Routing logic:
 * - procedure: ProcedureSteps component with interactive step tracking
 * - checklist: ChecklistView component with checkbox completion
 * - form: FormLink if formId exists, else DocumentViewer
 * - reference/guide/default: DocumentViewer for markdown/binary content
 */
export function ContentTypeRenderer({ document, fileUrl }: ContentTypeRendererProps) {
  switch (document.contentType) {
    case "procedure":
      return <ProcedureSteps document={document} />;

    case "checklist":
      return <ChecklistView document={document} />;

    case "form":
      // Link to form builder form if formId exists, else show as reference
      if (document.formId) {
        return <FormLink formId={document.formId} documentTitle={document.title} />;
      }
      return <DocumentViewer document={document} fileUrl={fileUrl} />;

    case "reference":
    case "guide":
    default:
      return <DocumentViewer document={document} fileUrl={fileUrl} />;
  }
}
