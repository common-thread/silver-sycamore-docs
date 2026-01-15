"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface BreadcrumbProps {
  documentTitle?: string;
  categoryName?: string;
}

function formatSegment(slug: string): string {
  // Special case handling for common slugs
  const specialCases: Record<string, string> = {
    hr: "HR",
    "day-of": "Day-Of",
    "add-ons": "Add-Ons",
  };

  if (specialCases[slug]) {
    return specialCases[slug];
  }

  // Convert slug to title case
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ChevronSeparator() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        margin: "0 0.375rem",
        color: "var(--color-ink-muted)",
        opacity: 0.6,
      }}
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Breadcrumb({ documentTitle, categoryName }: BreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb items
  const items: Array<{ label: string; href: string; isCurrent: boolean }> = [
    { label: "Home", href: "/", isCurrent: false },
  ];

  segments.forEach((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;

    // Use provided names if available
    let label = formatSegment(seg);
    if (i === 0 && categoryName) {
      label = categoryName;
    }
    if (isLast && documentTitle) {
      label = documentTitle;
    }

    items.push({ label, href, isCurrent: isLast });
  });

  return (
    <nav
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.8125rem",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {items.map((item, i) => (
        <span key={item.href} style={{ display: "inline-flex", alignItems: "center" }}>
          {i > 0 && <ChevronSeparator />}
          {item.isCurrent ? (
            <span
              style={{
                color: "var(--color-ink)",
                fontWeight: 500,
              }}
            >
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              style={{
                color: "var(--color-ink-muted)",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-ink-muted)";
              }}
            >
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
