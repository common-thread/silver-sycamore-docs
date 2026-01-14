"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

function formatSegment(slug: string): string {
  // Special case handling for common slugs
  const specialCases: Record<string, string> = {
    "hr": "HR",
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

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav style={{ color: "var(--color-ink-muted)", marginBottom: "1rem", fontSize: "0.875rem" }}>
      <Link href="/" style={{ color: "var(--color-ink-muted)" }}>
        Home
      </Link>
      {segments.map((seg, i) => (
        <span key={i}>
          {" / "}
          <Link
            href={"/" + segments.slice(0, i + 1).join("/")}
            style={{ color: "var(--color-ink-muted)" }}
          >
            {formatSegment(seg)}
          </Link>
        </span>
      ))}
    </nav>
  );
}
