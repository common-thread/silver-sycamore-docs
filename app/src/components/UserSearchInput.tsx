"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface UserSearchInputProps {
  onSelect: (userId: Id<"users">) => void;
  excludeUserIds?: Id<"users">[];
  placeholder?: string;
  autoFocus?: boolean;
}

export function UserSearchInput({
  onSelect,
  excludeUserIds = [],
  placeholder = "Search users...",
  autoFocus = false,
}: UserSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get current user to exclude from results
  const currentUser = useQuery(api.users.getCurrentUser);

  // Search users
  const searchResults = useQuery(
    api.users.searchUsers,
    debouncedQuery.length >= 1 ? { query: debouncedQuery, limit: 10 } : "skip"
  );

  // Filter out excluded users and current user
  const filteredResults = (searchResults ?? []).filter((user) => {
    if (currentUser && user.id === currentUser.id) return false;
    if (excludeUserIds.includes(user.id as Id<"users">)) return false;
    return true;
  });

  const showDropdown = isFocused && debouncedQuery.length >= 1 && filteredResults.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (userId: Id<"users">) => {
    onSelect(userId);
    setSearchQuery("");
    setDebouncedQuery("");
    setIsFocused(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {/* Search input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1rem",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 0,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <circle
            cx="7"
            cy="7"
            r="4"
            stroke="var(--color-ink-muted)"
            strokeWidth="1.2"
          />
          <path
            d="M10 10L14 14"
            stroke="var(--color-ink-muted)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          style={{
            flex: 1,
            fontFamily: "var(--font-body)",
            fontSize: "0.9375rem",
            color: "var(--color-ink)",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />
      </div>

      {/* Results dropdown */}
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            zIndex: 100,
            maxHeight: "300px",
            overflow: "auto",
          }}
        >
          {filteredResults.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelect(user.id as Id<"users">)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                width: "100%",
                padding: "0.75rem 1rem",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid var(--color-border)",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-surface-dim, #F8F8F6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-surface)",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {(user.displayName || user.name || user.email || "?").charAt(0)}
              </div>

              {/* User info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    color: "var(--color-ink)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.displayName || user.name || user.email}
                </div>
                {(user.displayName || user.name) && (
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "var(--color-ink-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.email}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {isFocused && debouncedQuery.length >= 1 && searchResults !== undefined && filteredResults.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            padding: "1rem",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            zIndex: 100,
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ink-muted)",
            textAlign: "center",
          }}
        >
          No users found matching &quot;{debouncedQuery}&quot;
        </div>
      )}
    </div>
  );
}
