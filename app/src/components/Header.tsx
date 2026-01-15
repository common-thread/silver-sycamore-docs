"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/clients", label: "Clients" },
  { href: "/staff", label: "Staff" },
  { href: "/operations", label: "Operations" },
  { href: "/deliverables", label: "Deliverables" },
  { href: "/catalog", label: "Catalog" },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Brand bar */}
      <div
        style={{
          padding: "1.25rem 2rem",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: "0.75rem",
            textDecoration: "none",
          }}
        >
          {/* Logo mark - minimal geometric */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "2rem",
              height: "2rem",
              background: "var(--color-accent)",
              color: "var(--color-surface)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.125rem",
              letterSpacing: "-0.02em",
            }}
          >
            SS
          </span>
          {/* Brand name */}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--color-ink)",
              letterSpacing: "-0.02em",
            }}
          >
            Silver Sycamore
          </span>
          {/* Subtitle */}
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--color-ink-muted)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              marginLeft: "0.25rem",
            }}
          >
            Staff Hub
          </span>
        </Link>
        <UserMenu />
      </div>

      {/* Navigation - table of contents style */}
      <nav
        style={{
          padding: "0 2rem",
          background: "var(--color-surface-dim)",
        }}
      >
        <ul
          style={{
            display: "flex",
            gap: "0",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {navItems.map((item, index) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    display: "block",
                    padding: "0.875rem 1.5rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    fontWeight: active ? 600 : 500,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: active ? "var(--color-accent)" : "var(--color-ink-light)",
                    textDecoration: "none",
                    borderBottom: active
                      ? "2px solid var(--color-accent)"
                      : "2px solid transparent",
                    marginBottom: "-1px",
                    transition: "color 0.15s ease, border-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--color-ink)";
                      e.currentTarget.style.borderColor = "var(--color-border-strong)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--color-ink-light)";
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  {item.label}
                </Link>
                {/* Visual separator between items */}
                {index < navItems.length - 1 && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      display: "none", // Hidden for now, can enable for more editorial feel
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
