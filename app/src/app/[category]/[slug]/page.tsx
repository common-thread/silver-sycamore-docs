"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentBox } from "@/components/ContentBox";
import { DocumentViewer } from "@/components/DocumentViewer";
import { useParams } from "next/navigation";

export default function DocumentPage() {
  const { slug } = useParams();
  const document = useQuery(api.documents.bySlug, { slug: slug as string });

  if (document === undefined) {
    return (
      <>
        <Breadcrumb />
        <ContentBox>
          <div className="text-[#586069]">Loading document...</div>
        </ContentBox>
      </>
    );
  }

  if (document === null) {
    return (
      <>
        <Breadcrumb />
        <ContentBox>
          <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
          <p className="text-[#586069]">
            The requested document could not be found.
          </p>
        </ContentBox>
      </>
    );
  }

  return (
    <>
      <Breadcrumb />
      <ContentBox>
        <DocumentViewer document={document} />
      </ContentBox>
    </>
  );
}
