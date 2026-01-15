"use client";

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface UserResult {
  id: Id<"users">;
  email?: string;
  name?: string;
  displayName?: string;
}

interface MentionDropdownPosition {
  top: number;
  left: number;
}

export function MentionInput({
  value,
  onChange,
  placeholder = "Add a comment...",
  rows = 3,
}: MentionInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [mentionQuery, setMentionQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<MentionDropdownPosition>({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(mentionQuery), 300);
    return () => clearTimeout(timer);
  }, [mentionQuery]);

  // Search users with debounced query (min 2 chars)
  const results = useQuery(
    api.users.searchUsers,
    debouncedQuery.length >= 2 ? { query: debouncedQuery } : "skip"
  );

  const filteredResults = results ?? [];

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults.length]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate dropdown position based on cursor position
  const calculateDropdownPosition = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Create a mirror div to calculate cursor position
    const mirror = document.createElement("div");
    const style = window.getComputedStyle(textarea);

    mirror.style.position = "absolute";
    mirror.style.visibility = "hidden";
    mirror.style.whiteSpace = "pre-wrap";
    mirror.style.wordWrap = "break-word";
    mirror.style.width = style.width;
    mirror.style.padding = style.padding;
    mirror.style.fontFamily = style.fontFamily;
    mirror.style.fontSize = style.fontSize;
    mirror.style.lineHeight = style.lineHeight;
    mirror.style.letterSpacing = style.letterSpacing;

    const textBeforeCursor = value.substring(0, textarea.selectionStart);
    mirror.textContent = textBeforeCursor;

    const marker = document.createElement("span");
    marker.textContent = "|";
    mirror.appendChild(marker);

    document.body.appendChild(mirror);

    const markerRect = marker.getBoundingClientRect();
    const textareaRect = textarea.getBoundingClientRect();

    document.body.removeChild(mirror);

    // Position dropdown below the cursor position
    setDropdownPosition({
      top: markerRect.top - textareaRect.top + parseInt(style.lineHeight || "20") + textarea.scrollTop,
      left: Math.min(markerRect.left - textareaRect.left, textarea.clientWidth - 250),
    });
  }, [value]);

  // Detect @mention pattern
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    onChange(newValue);

    // Look for @ pattern before cursor
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      // Check if text after @ is a valid mention query (word characters only, no spaces)
      const mentionMatch = textAfterAt.match(/^(\w*)$/);

      if (mentionMatch) {
        const query = mentionMatch[1];
        setMentionStart(lastAtIndex);
        setMentionQuery(query);

        if (query.length >= 2) {
          setShowDropdown(true);
          calculateDropdownPosition();
        } else {
          setShowDropdown(false);
        }
      } else {
        // Space or special char after @ - close dropdown
        setShowDropdown(false);
        setMentionStart(null);
        setMentionQuery("");
      }
    } else {
      setShowDropdown(false);
      setMentionStart(null);
      setMentionQuery("");
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showDropdown || filteredResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredResults.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredResults.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          insertMention(filteredResults[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowDropdown(false);
        break;
      case "Tab":
        if (filteredResults[selectedIndex]) {
          e.preventDefault();
          insertMention(filteredResults[selectedIndex]);
        }
        break;
    }
  };

  // Insert mention into text
  const insertMention = (user: UserResult) => {
    if (mentionStart === null) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const beforeMention = value.substring(0, mentionStart);
    const afterCursor = value.substring(cursorPos);

    // Insert @[userId] format
    const mentionText = `@[${user.id}]`;
    const newValue = beforeMention + mentionText + " " + afterCursor;

    onChange(newValue);

    // Reset state
    setShowDropdown(false);
    setMentionStart(null);
    setMentionQuery("");
    setDebouncedQuery("");

    // Move cursor after the mention
    setTimeout(() => {
      const newCursorPos = beforeMention.length + mentionText.length + 1;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const showDropdownResults = showDropdown && debouncedQuery.length >= 2;

  return (
    <div style={{ position: "relative" }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          minHeight: `${rows * 1.5}rem`,
          padding: "0.75rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          resize: "vertical",
          lineHeight: 1.6,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--color-accent)";
          e.currentTarget.style.outline = "none";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
        }}
      />

      {/* Autocomplete dropdown */}
      {showDropdownResults && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: "250px",
            maxHeight: "200px",
            overflowY: "auto",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 50,
          }}
        >
          {filteredResults.length === 0 ? (
            <div
              style={{
                padding: "0.75rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "var(--color-ink-muted)",
                textAlign: "center",
              }}
            >
              No users found
            </div>
          ) : (
            filteredResults.map((user, index) => (
              <button
                key={user.id}
                onClick={() => insertMention(user)}
                onMouseEnter={() => setSelectedIndex(index)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  fontFamily: "var(--font-body)",
                  textAlign: "left",
                  background: index === selectedIndex ? "var(--color-surface-dim)" : "transparent",
                  border: "none",
                  borderBottom: index < filteredResults.length - 1 ? "1px solid var(--color-border)" : "none",
                  cursor: "pointer",
                  transition: "background 0.1s ease",
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
