"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";

interface UserPickerUser {
  id: Id<"users">;
  email?: string;
  name?: string;
  displayName?: string;
}

interface UserPickerProps {
  onSelect: (user: UserPickerUser) => void;
  placeholder?: string;
  excludeIds?: Id<"users">[];
}

export function UserPicker({
  onSelect,
  placeholder = "Search by name or email...",
  excludeIds = [],
}: UserPickerProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Search users with debounced query (min 2 chars)
  const results = useQuery(
    api.users.searchUsers,
    debouncedQuery.length >= 2 ? { query: debouncedQuery } : "skip"
  );

  // Filter out excluded users
  const filteredResults = (results ?? []).filter(
    (user) => !excludeIds.includes(user.id)
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (user: UserPickerUser) => {
    onSelect(user);
    setQuery("");
    setDebouncedQuery("");
    setIsOpen(false);
  };

  const showDropdown = isOpen && debouncedQuery.length >= 2;

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.625rem 0.75rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          color: "var(--color-ink)",
          background: "var(--color-background)",
          border: "1px solid var(--color-border)",
          borderRadius: "2px",
          outline: "none",
        }}
      />

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
            borderRadius: "2px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
            maxHeight: "240px",
            overflowY: "auto",
          }}
        >
          {filteredResults.length === 0 ? (
            <div
              style={{
                padding: "1rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "var(--color-ink-muted)",
                textAlign: "center",
              }}
            >
              No users found
            </div>
          ) : (
            filteredResults.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelect(user)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  fontFamily: "var(--font-body)",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--color-border)",
                  cursor: "pointer",
                  transition: "background 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-background)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--color-ink)",
                  }}
                >
                  {user.displayName || user.name || user.email}
                </div>
                {(user.displayName || user.name) && user.email && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-ink-muted)",
                      marginTop: "2px",
                    }}
                  >
                    {user.email}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
