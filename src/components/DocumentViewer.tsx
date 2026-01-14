"use client";

interface Document {
  _id: string;
  title: string;
  content: string;
  sourceType?: string;
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

  // For Office docs and PDFs, use iframe
  if (["docx", "xlsx", "pdf"].includes(sourceType) && fileUrl) {
    const viewerUrl =
      sourceType === "pdf"
        ? fileUrl
        : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">{document.title}</h1>
        {document.description && (
          <p className="text-[#586069] mb-4">{document.description}</p>
        )}
        <div className="border border-[#e1e4e8] rounded-md overflow-hidden">
          <div className="bg-[#f6f8fa] px-4 py-2 border-b border-[#e1e4e8] flex justify-between items-center">
            <span className="text-sm">{document.title}</span>
            <a
              href={fileUrl}
              download
              className="text-[#0366d6] text-sm hover:underline"
            >
              Download
            </a>
          </div>
          <iframe src={viewerUrl} className="w-full h-[600px] border-0" />
        </div>
      </div>
    );
  }

  // For markdown, render content
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{document.title}</h1>
      {document.description && (
        <p className="text-[#586069] mb-4">{document.description}</p>
      )}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: document.content }}
      />
    </div>
  );
}
