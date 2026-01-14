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
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            color: "var(--color-ink)",
          }}
        >
          {document.title}
        </h1>
        {document.description && (
          <p style={{ color: "var(--color-ink-muted)", marginBottom: "1.5rem" }}>
            {document.description}
          </p>
        )}
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "var(--color-cream-dark)",
              padding: "0.75rem 1rem",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.875rem" }}>{document.title}</span>
            <a
              href={fileUrl}
              download
              style={{
                color: "var(--color-accent)",
                fontSize: "0.875rem",
              }}
            >
              Download
            </a>
          </div>
          <iframe src={viewerUrl} className="w-full h-[600px] border-0" />
        </div>
      </div>
    );
  }

  // For binary files without fileUrl, show document info card
  if (["docx", "xlsx", "pdf"].includes(sourceType)) {
    const typeLabels: Record<string, string> = {
      docx: "Word Document",
      xlsx: "Excel Spreadsheet",
      pdf: "PDF Document",
    };

    return (
      <div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            color: "var(--color-ink)",
          }}
        >
          {document.title}
        </h1>
        {document.description && (
          <p style={{ color: "var(--color-ink-muted)", marginBottom: "1.5rem" }}>
            {document.description}
          </p>
        )}
        <div
          style={{
            background: "var(--color-cream-dark)",
            border: "1px solid var(--color-border)",
            borderRadius: "4px",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              opacity: 0.5,
            }}
          >
            {sourceType === "docx" && "📄"}
            {sourceType === "xlsx" && "📊"}
            {sourceType === "pdf" && "📑"}
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            {typeLabels[sourceType] || "Document"}
          </h3>
          {document.sourceFile && (
            <p style={{ color: "var(--color-ink-muted)", fontSize: "0.875rem" }}>
              {document.sourceFile}
            </p>
          )}
          <p
            style={{
              color: "var(--color-ink-muted)",
              fontSize: "0.875rem",
              marginTop: "1rem",
            }}
          >
            Document preview coming soon
          </p>
        </div>
      </div>
    );
  }

  // For markdown, render content using ReactMarkdown
  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.75rem",
          fontWeight: 600,
          marginBottom: "0.5rem",
          color: "var(--color-ink)",
        }}
      >
        {document.title}
      </h1>
      {document.description && (
        <p style={{ color: "var(--color-ink-muted)", marginBottom: "1.5rem" }}>
          {document.description}
        </p>
      )}
      <div className="prose">
        <ReactMarkdown>{document.content}</ReactMarkdown>
      </div>
    </div>
  );
}
