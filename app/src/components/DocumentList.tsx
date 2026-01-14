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
    return (
      <div style={{ color: "var(--color-ink-muted)" }}>
        Loading documents...
      </div>
    );
  }

  const filtered = subcategory
    ? docs.filter((d) => d.subcategory === subcategory)
    : docs;

  if (filtered.length === 0) {
    return (
      <div style={{ color: "var(--color-ink-muted)" }}>No documents found.</div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Document</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((d) => (
          <tr key={d._id}>
            <td>
              <Link href={`/${category}/${d.slug}`}>{d.title}</Link>
            </td>
            <td style={{ color: "var(--color-ink-muted)" }}>
              {d.description || "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
