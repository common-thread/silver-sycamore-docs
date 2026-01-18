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

  // For markdown, render content using ReactMarkdown
  return (
    <div>
      <h1 className="document-title">{document.title}</h1>
      {document.description && (
        <p className="document-description">{document.description}</p>
      )}
      <div className="prose">
        <ReactMarkdown>{document.content}</ReactMarkdown>
      </div>
    </div>
  );
}
