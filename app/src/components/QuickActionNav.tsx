"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const quickActions = [
  {
    href: "/procedures",
    label: "Procedures",
    description: "Step-by-step instructions for daily operations",
    contentType: "procedure",
  },
  {
    href: "/references",
    label: "References",
    description: "Packages, menus, pricing, and venue layouts",
    contentType: "reference",
  },
  {
    href: "/checklists",
    label: "Checklists",
    description: "Planning checklists and task lists",
    contentType: "checklist",
  },
  {
    href: "/guides",
    label: "Guides",
    description: "Navigation and overview documents",
    contentType: "guide",
  },
  {
    href: "/forms",
    label: "Forms",
    description: "Create, send, and manage forms",
    contentType: null, // No count, links to forms section
  },
];

export function QuickActionNav() {
  const counts = useQuery(api.documents.contentTypeCounts);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quickActions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="block p-5 no-underline transition-all duration-150"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "0",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-accent)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <h3
            className="font-semibold mb-1"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-ink)",
              fontSize: "var(--text-lg)",
            }}
          >
            {action.label}
          </h3>
          <p
            className="text-sm m-0 mb-2"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {action.description}
          </p>
          {action.contentType && counts && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                color: "var(--color-ink-light)",
              }}
            >
              {counts[action.contentType] ?? 0} documents
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
