"use client";

import { Id } from "../../../convex/_generated/dataModel";
import type { SelectedUser } from "./hooks/useShareLinkForm";

interface UserChipListProps {
  users: SelectedUser[];
  onRemove: (userId: Id<"users">) => void;
}

export function UserChipList({ users, onRemove }: UserChipListProps) {
  if (users.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.375rem",
        marginTop: "0.5rem",
      }}
    >
      {users.map((user) => (
        <span
          key={user.id}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.5rem",
            background: "var(--color-background)",
            borderRadius: "2px",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--color-ink)",
          }}
        >
          {user.displayName || user.name || user.email}
          <button
            onClick={() => onRemove(user.id)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0",
              color: "var(--color-ink-muted)",
              display: "flex",
              alignItems: "center",
            }}
            aria-label={`Remove ${user.displayName || user.name || user.email}`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M3 3L9 9M9 3L3 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </span>
      ))}
    </div>
  );
}
