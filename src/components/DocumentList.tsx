"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

export function DocumentList({
  category,
  subcategory,
}: {
  category: string;
  subcategory?: string;
}) {
  const docs = useQuery(api.documents.byCategory, { category });

  if (!docs) {
    return <div className="text-[#586069]">Loading documents...</div>;
  }

  const filtered = subcategory
    ? docs.filter((d) => d.subcategory === subcategory)
    : docs;

  if (filtered.length === 0) {
    return <div className="text-[#586069]">No documents found.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Document</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((d) => (
          <tr key={d._id}>
            <td>
              <Link href={`/${category}/${d.slug}`} className="text-[#0366d6]">
                {d.title}
              </Link>
            </td>
            <td className="text-[#586069]">{d.sourceType || "md"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
