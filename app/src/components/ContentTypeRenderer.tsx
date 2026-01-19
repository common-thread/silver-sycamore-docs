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
 * ContentTypeRenderer - renders documents via DocumentViewer.
 *
 * The contentType field is preserved for future content-aware rendering.
 * Currently uses pattern-based detection for timelines and checklists.
 */
export function ContentTypeRenderer({ document, fileUrl }: ContentTypeRendererProps) {
  return <DocumentViewer document={document} fileUrl={fileUrl} />;
}
