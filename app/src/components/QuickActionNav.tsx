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
          className="quick-action-card"
        >
          <h3 className="quick-action-title">{action.label}</h3>
          <p className="quick-action-description">{action.description}</p>
          {action.contentType && counts && (
            <span className="quick-action-meta">
              {counts[action.contentType] ?? 0} documents
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
