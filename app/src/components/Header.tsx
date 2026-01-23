"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// CONNECTOR: useAuth from @clerk/nextjs - restore from feature/full-v1
import { UserMenu } from "./UserMenu";
import { SearchBar } from "./SearchBar";
// CONNECTOR: NotificationBell - restore from feature/full-v1
import { LogoFull } from "./Logo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/services", label: "Services" },
  { href: "/operations", label: "Operations" },
  { href: "/brand", label: "Brand" },
  // CONNECTOR: Messages, Forms, Activity routes - restore from feature/full-v1
  { href: "/workspace", label: "My Workspace" },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="site-header">
      {/* Brand bar */}
      <div className="header-brand-bar">
        <Link href="/" className="header-brand-link">
          <LogoFull size="sm" />
          <span className="header-brand-tag">Staff Hub</span>
        </Link>

        {/* Search and User Menu */}
        <div className="header-actions">
          <SearchBar />
          {/* CONNECTOR: NotificationBell - restore from feature/full-v1 */}
          <UserMenu />
        </div>
      </div>

      {/* Navigation - table of contents style */}
      <nav className="header-nav">
        <ul className="header-nav-list">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`header-nav-link ${active ? "header-nav-link-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
