"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { UserMenu } from "./UserMenu";
import { SearchBar } from "./SearchBar";
import { NotificationBell } from "./NotificationBell";
import { LogoFull } from "./Logo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/clients", label: "Clients" },
  { href: "/staff", label: "Staff" },
  { href: "/operations", label: "Operations" },
  { href: "/deliverables", label: "Deliverables" },
  { href: "/messages", label: "Messages" },
  { href: "/forms", label: "Forms" },
  { href: "/workspace", label: "My Workspace" },
];

export default function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

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
            alignItems: "center",
            gap: "var(--space-4)",
            textDecoration: "none",
          }}
        >
          {/* Full logo lockup - icon + wordmark together */}
          <LogoFull size="sm" />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-semibold)",
              color: "var(--color-champagne-deep)",
              letterSpacing: "var(--tracking-wider)",
              textTransform: "uppercase",
              paddingLeft: "var(--space-3)",
              borderLeft: "1px solid var(--color-border)",
            }}
          >
            Staff Hub
          </span>
        </Link>

        {/* Search, Notifications, and User Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <SearchBar />
          {isSignedIn && <NotificationBell />}
          <UserMenu />
        </div>
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
