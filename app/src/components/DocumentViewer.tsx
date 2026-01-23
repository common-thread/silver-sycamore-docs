"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { ReactNode } from "react";

interface Document {
  _id: string;
  title: string;
  content: string;
  sourceType?: string;
  sourceFile?: string;
  description?: string;
}

type ContentType = "procedure" | "reference" | "form" | "checklist" | "guide";

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

// Extract text content from React children for pattern matching
function getTextContent(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(getTextContent).join("");
  if (children && typeof children === "object" && "props" in children) {
    return getTextContent((children as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

// Create custom markdown components based on contentType
function getMarkdownComponents(contentType?: ContentType): Components {
  return {
    // For checklists/procedures: render list items as interactive checkboxes
    li: ({ children, ...props }) => {
      const text = getTextContent(children);

      // Check if this is a checkbox item (starts with [ ] or [x])
      const checkboxMatch = text.match(/^\[([ xX])\]\s*/);

      // Render as checkbox if: explicit checkbox syntax OR checklist/procedure type
      if (checkboxMatch || contentType === "checklist" || contentType === "procedure") {
        const isChecked = checkboxMatch ? checkboxMatch[1].toLowerCase() === "x" : false;
        // Strip the checkbox syntax from content if present
        const content = checkboxMatch
          ? text.replace(/^\[([ xX])\]\s*/, "")
          : children;

        return (
          <li
            className="checklist-item"
            data-checked={isChecked}
            role="checkbox"
            aria-checked={isChecked}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                // Note: Toggle functionality would require state management
                // This provides keyboard accessibility for read-only checklists
              }
            }}
            {...props}
          >
            <span className="checkbox-indicator" aria-hidden="true" />
            <span className="task-text">{content}</span>
          </li>
        );
      }

      return <li {...props}>{children}</li>;
    },

    // Style H2s as section headers with accent bar
    h2: ({ children, ...props }) => (
      <h2 className="section-header" {...props}>{children}</h2>
    ),
  };
}

export function DocumentViewer({
  document,
  fileUrl,
  contentType,
}: {
  document: Document;
  fileUrl?: string;
  contentType?: ContentType;
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

  // Get content-type-aware markdown components
  const components = getMarkdownComponents(contentType);

  // Render markdown with GFM support and custom components
  return (
    <div>
      <h1 className="document-title">{document.title}</h1>
      {document.description && (
        <p className="document-description">{document.description}</p>
      )}
      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {processedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
