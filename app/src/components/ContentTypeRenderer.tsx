"use client";

import { DocumentViewer } from "./DocumentViewer";

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
 * ContentTypeRenderer - renders all document types via DocumentViewer.
 *
 * CONNECTOR: Interactive content rendering - restore from feature/full-v1
 * Previously routed procedure -> ProcedureSteps, checklist -> ChecklistView, form -> FormLink
 */
export function ContentTypeRenderer({ document, fileUrl }: ContentTypeRendererProps) {
  // All content types now render as standard documents
  // The contentType field is preserved for future re-enablement
  return <DocumentViewer document={document} fileUrl={fileUrl} />;
}
