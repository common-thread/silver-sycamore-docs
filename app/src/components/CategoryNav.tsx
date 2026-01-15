"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

interface CategoryNavProps {
  currentCategory?: string;
}

export function CategoryNav({ currentCategory }: CategoryNavProps) {
  const pathname = usePathname();
  const categories = useQuery(api.categories.list);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(currentCategory ? [currentCategory] : [])
  );

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  if (!categories) {
    return (
      <nav style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem" }}>
        <div style={{ color: "var(--color-ink-muted)", padding: "0.5rem 0" }}>
          Loading categories...
        </div>
      </nav>
    );
  }

  return (
    <nav
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.875rem",
      }}
    >
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.slug);
          const isActive = pathname.startsWith(`/${category.slug}`);

          return (
            <li key={category.slug} style={{ marginBottom: "0.25rem" }}>
              {/* Category Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {/* Expand/Collapse Button */}
                <button
                  onClick={() => toggleCategory(category.slug)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "0.25rem",
                    cursor: "pointer",
                    color: "var(--color-ink-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.15s ease",
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                  >
                    <path d="M4 2l4 4-4 4V2z" />
                  </svg>
                </button>

                {/* Category Link */}
                <Link
                  href={`/${category.slug}`}
                  style={{
                    flex: 1,
                    padding: "0.375rem 0",
                    color: isActive ? "var(--color-accent)" : "var(--color-ink)",
                    fontWeight: isActive ? 600 : 500,
                    textDecoration: "none",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--color-accent)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--color-ink)";
                    }
                  }}
                >
                  {category.name}
                </Link>
              </div>

              {/* Subcategories */}
              {isExpanded && (
                <SubcategoryList
                  categorySlug={category.slug}
                  pathname={pathname}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SubcategoryList({
  categorySlug,
  pathname,
}: {
  categorySlug: string;
  pathname: string;
}) {
  const subcategories = useQuery(api.subcategories.byCategorySlug, {
    categorySlug,
  });

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <ul
      style={{
        listStyle: "none",
        margin: 0,
        padding: "0.25rem 0 0.25rem 1.5rem",
        borderLeft: "1px solid var(--color-border)",
        marginLeft: "0.5rem",
      }}
    >
      {subcategories.map((sub) => {
        const subPath = `/${categorySlug}/${sub.slug}`;
        const isActive = pathname === subPath || pathname.startsWith(`${subPath}/`);

        return (
          <li key={sub.slug}>
            <Link
              href={subPath}
              style={{
                display: "block",
                padding: "0.25rem 0",
                color: isActive ? "var(--color-accent)" : "var(--color-ink-light)",
                fontSize: "0.8125rem",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--color-ink)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--color-ink-light)";
                }
              }}
            >
              {sub.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
