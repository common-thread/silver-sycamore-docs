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
 * Passes contentType to DocumentViewer for content-aware rendering:
 * - checklist/procedure: items render as interactive checkboxes
 * - reference: tables and timelines styled
 * - guide: standard prose
 */
export function ContentTypeRenderer({ document, fileUrl }: ContentTypeRendererProps) {
  return (
    <DocumentViewer
      document={document}
      fileUrl={fileUrl}
      contentType={document.contentType}
    />
  );
}
