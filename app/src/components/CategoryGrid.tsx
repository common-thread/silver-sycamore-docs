"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Fallback categories if Convex data isn't loaded yet
const fallbackCategories = [
  { slug: "services", name: "Services", description: "Wedding packages, event packages, catering menus" },
  { slug: "clients", name: "Clients", description: "Booking forms, planning checklists, room layouts" },
  { slug: "staff", name: "Staff", description: "Training programs, procedures, HR forms" },
  { slug: "operations", name: "Operations", description: "Appointment forms, bar tracking, facilities" },
  { slug: "deliverables", name: "Deliverables", description: "Recipe app and other projects" },
];

export function CategoryGrid() {
  const categories = useQuery(api.categories.list);
  const displayCategories = categories ?? fallbackCategories;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayCategories.map((c) => (
        <Link
          key={c.slug}
          href={`/${c.slug}`}
          className="block p-5 no-underline transition-all duration-150"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "2px",
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
              fontSize: "1.1rem",
            }}
          >
            {c.name}
          </h3>
          <p
            className="text-sm m-0"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {c.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
