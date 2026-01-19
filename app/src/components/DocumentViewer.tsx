"use client";
import ReactMarkdown from "react-markdown";

interface Document {
  _id: string;
  title: string;
  content: string;
  sourceType?: string;
  sourceFile?: string;
  description?: string;
}

// Strip leading H1 if it matches the document title (avoids duplicate headings)
function processContent(content: string, title: string): string {
  const h1Pattern = /^#\s+(.+?)(?:\n|$)/;
  const match = content.match(h1Pattern);
  if (match) {
    // Normalize both for comparison (handle accents, case, punctuation)
    const contentH1 = match[1]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .trim();
    const docTitle = title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .trim();

    if (contentH1 === docTitle) {
      return content.replace(h1Pattern, "").trimStart();
    }
  }
  return content;
}

export function DocumentViewer({
  document,
  fileUrl,
}: {
  document: Document;
  fileUrl?: string;
}) {
  const sourceType = document.sourceType || "md";

  // For Office docs and PDFs with fileUrl, use iframe
  if (["docx", "xlsx", "pdf"].includes(sourceType) && fileUrl) {
    const viewerUrl =
      sourceType === "pdf"
        ? fileUrl
        : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

    return (
      <div>
        <h1 className="document-title">{document.title}</h1>
        {document.description && (
          <p className="document-description">{document.description}</p>
        )}
        <div className="document-embed-container">
          <div className="document-embed-header">
            <span className="document-embed-title">{document.title}</span>
            <a href={fileUrl} download className="document-download-link">
              Download
            </a>
          </div>
          <iframe src={viewerUrl} className="w-full h-[600px] border-0" />
        </div>
      </div>
    );
  }

  // For binary files without fileUrl, show clean pending conversion card
  if (["docx", "xlsx", "pdf"].includes(sourceType)) {
    return (
      <div>
        <h1 className="document-title">{document.title}</h1>
        {document.description && (
          <p className="document-description">{document.description}</p>
        )}
        <div className="document-pending">
          <p className="document-pending-text">
            This document is pending conversion.
          </p>
        </div>
      </div>
    );
  }

  // Process content to remove duplicate H1
  const processedContent = processContent(document.content, document.title);

  // Render markdown with default components - let CSS handle styling
  return (
    <div>
      <h1 className="document-title">{document.title}</h1>
      {document.description && (
        <p className="document-description">{document.description}</p>
      )}
      <div className="prose">
        <ReactMarkdown>{processedContent}</ReactMarkdown>
      </div>
    </div>
  );
}
