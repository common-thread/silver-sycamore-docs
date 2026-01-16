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
  { href: "/catalog", label: "Catalog" },
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

        {/* Search, Workspace, Notifications, and User Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <SearchBar />
          {isSignedIn && (
            <>
              <Link
                href="/workspace"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: pathname.startsWith("/workspace")
                    ? "var(--color-accent)"
                    : "var(--color-ink-light)",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 4.5C2 3.67 2.67 3 3.5 3H6L7.5 5H12.5C13.33 5 14 5.67 14 6.5V11.5C14 12.33 13.33 13 12.5 13H3.5C2.67 13 2 12.33 2 11.5V4.5Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    fill={pathname.startsWith("/workspace") ? "currentColor" : "none"}
                    fillOpacity={pathname.startsWith("/workspace") ? 0.1 : 0}
                  />
                </svg>
                My Workspace
              </Link>
              <Link
                href="/forms"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: pathname.startsWith("/forms")
                    ? "var(--color-accent)"
                    : "var(--color-ink-light)",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.5L13 5.5V13.5C13 13.7761 12.7761 14 12.5 14H3.5C3.22386 14 3 13.7761 3 13.5V2.5Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    fill={pathname.startsWith("/forms") ? "currentColor" : "none"}
                    fillOpacity={pathname.startsWith("/forms") ? 0.1 : 0}
                  />
                  <path
                    d="M5.5 7.5H10.5M5.5 9.5H10.5M5.5 11.5H8"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                Forms
              </Link>
              <Link
                href="/messages"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: pathname.startsWith("/messages")
                    ? "var(--color-accent)"
                    : "var(--color-ink-light)",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 4C2 3.44772 2.44772 3 3 3H13C13.5523 3 14 3.44772 14 4V10C14 10.5523 13.5523 11 13 11H8L5 14V11H3C2.44772 11 2 10.5523 2 10V4Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    fill={pathname.startsWith("/messages") ? "currentColor" : "none"}
                    fillOpacity={pathname.startsWith("/messages") ? 0.1 : 0}
                  />
                </svg>
                Messages
              </Link>
              <NotificationBell />
            </>
          )}
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
