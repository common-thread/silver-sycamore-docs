"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { NotificationInbox } from "./NotificationInbox";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = useQuery(api.notifications.getUnreadCount);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        bellRef.current &&
        !bellRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayCount = unreadCount !== undefined && unreadCount > 0
    ? unreadCount > 9 ? "9+" : unreadCount.toString()
    : null;

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={bellRef}
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: "36px",
          height: "36px",
          padding: 0,
          background: "transparent",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          color: isOpen ? "var(--color-accent)" : "var(--color-ink-light)",
          transition: "color 150ms ease, background 150ms ease",
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.color = "var(--color-ink)";
            e.currentTarget.style.background = "var(--color-surface-dim)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.color = "var(--color-ink-light)";
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        {/* Bell icon */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2C7.79086 2 6 3.79086 6 6V9C6 10.1046 5.10457 11 4 11V12H16V11C14.8954 11 14 10.1046 14 9V6C14 3.79086 12.2091 2 10 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 12V13C8 14.1046 8.89543 15 10 15C11.1046 15 12 14.1046 12 13V12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Unread badge */}
        {displayCount && (
          <span
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              minWidth: "16px",
              height: "16px",
              padding: "0 4px",
              fontFamily: "var(--font-body)",
              fontSize: "0.625rem",
              fontWeight: 600,
              color: "var(--color-surface)",
              background: "var(--color-accent)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            {displayCount}
          </span>
        )}
      </button>

      {/* Notification inbox dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 100,
          }}
        >
          <NotificationInbox onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
