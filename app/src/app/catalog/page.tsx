"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentBox } from "@/components/ContentBox";
import Link from "next/link";

export default function CatalogPage() {
  const documents = useQuery(api.documents.list);

  if (!documents) {
    return (
      <>
        <Breadcrumb />
        <ContentBox>
          <h1 className="text-2xl font-bold mb-4">Document Catalog</h1>
          <div style={{ color: "var(--color-ink-muted)" }}>Loading documents...</div>
        </ContentBox>
      </>
    );
  }

  // Group documents by category
  const grouped = documents.reduce(
    (acc, doc) => {
      const cat = doc.category || "uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(doc);
      return acc;
    },
    {} as Record<string, typeof documents>
  );

  return (
    <>
      <Breadcrumb />
      <ContentBox>
        <h1 className="text-2xl font-bold mb-4">Document Catalog</h1>
        <p className="mb-6" style={{ color: "var(--color-ink-muted)" }}>
          Complete listing of all documents in the library.
        </p>

        {Object.entries(grouped).map(([category, docs]) => (
          <section key={category} className="mb-6">
            <h2 className="text-xl font-semibold mb-2 capitalize">{category}</h2>
            <table>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Subcategory</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <Link
                        href={`/${doc.category}/${doc.slug}`}
                        style={{ color: "var(--color-accent)" }}
                      >
                        {doc.title}
                      </Link>
                    </td>
                    <td className="capitalize" style={{ color: "var(--color-ink-muted)" }}>
                      {doc.subcategory?.replace(/-/g, " ") || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </ContentBox>
    </>
  );
}
