"use client";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  MouseEvent,
} from "react";

type SelectSize = "sm" | "md" | "lg";
type SelectVariant = "default" | "filled";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  searchable?: boolean | "auto";
  inputSize?: SelectSize;
  variant?: SelectVariant;
  className?: string;
  id?: string;
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select an option...",
      label,
      error,
      hint,
      disabled = false,
      searchable = "auto",
      inputSize = "md",
      variant = "default",
      className = "",
      id,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const listboxId = `${selectId}-listbox`;
    const hasError = Boolean(error);

    // Determine if search should be enabled
    const isSearchable =
      searchable === true || (searchable === "auto" && options.length > 5);

    // Filter options based on search term
    const filteredOptions = isSearchable && searchTerm
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    // Get selected option
    const selectedOption = options.find((opt) => opt.value === value);

    // Size styles matching Input component
    const getSizeStyles = () => {
      switch (inputSize) {
        case "sm":
          return {
            padding: "0.5rem 0.75rem",
            paddingRight: "2rem",
            fontSize: "0.8125rem",
            minHeight: "2rem",
          };
        case "lg":
          return {
            padding: "1rem 1.25rem",
            paddingRight: "2.5rem",
            fontSize: "1rem",
            minHeight: "3rem",
          };
        default: // md
          return {
            padding: "0.75rem 1rem",
            paddingRight: "2.5rem",
            fontSize: "0.875rem",
            minHeight: "2.5rem",
          };
      }
    };

    // Variant styles matching Input component
    const getVariantStyles = () => {
      if (variant === "filled") {
        return {
          backgroundColor: disabled
            ? "var(--color-surface-dim)"
            : "var(--color-surface-dim)",
          borderColor: hasError
            ? "#C75050"
            : isOpen
            ? "var(--color-accent)"
            : "transparent",
        };
      }
      // default variant
      return {
        backgroundColor: disabled
          ? "var(--color-surface-dim)"
          : "var(--color-surface)",
        borderColor: hasError
          ? "#C75050"
          : isOpen
          ? "var(--color-accent)"
          : "var(--color-border)",
      };
    };

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: globalThis.MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && isSearchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, isSearchable]);

    // Scroll highlighted item into view
    useEffect(() => {
      if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
        const highlightedElement = listboxRef.current.children[
          highlightedIndex
        ] as HTMLElement;
        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            block: "nearest",
          });
        }
      }
    }, [highlightedIndex, isOpen]);

    // Reset highlighted index when filtered options change
    useEffect(() => {
      setHighlightedIndex(-1);
    }, [searchTerm]);

    const handleToggle = () => {
      if (disabled) return;
      if (!isOpen) {
        setIsOpen(true);
        // Set highlighted index to selected option if exists
        const selectedIndex = filteredOptions.findIndex(
          (opt) => opt.value === value
        );
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      } else {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    const handleSelect = useCallback(
      (optionValue: string) => {
        onChange?.(optionValue);
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      },
      [onChange]
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            const selectedIndex = filteredOptions.findIndex(
              (opt) => opt.value === value
            );
            setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
          } else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value);
          }
          break;

        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            const selectedIndex = filteredOptions.findIndex(
              (opt) => opt.value === value
            );
            setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
          } else {
            setHighlightedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : prev
            );
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          }
          break;

        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;

        case "Tab":
          if (isOpen) {
            setIsOpen(false);
            setSearchTerm("");
            setHighlightedIndex(-1);
          }
          break;

        case "Home":
          if (isOpen) {
            event.preventDefault();
            setHighlightedIndex(0);
          }
          break;

        case "End":
          if (isOpen) {
            event.preventDefault();
            setHighlightedIndex(filteredOptions.length - 1);
          }
          break;
      }
    };

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value);
          }
          break;

        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;

        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;

        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;

        case "Home":
          event.preventDefault();
          setHighlightedIndex(0);
          break;

        case "End":
          event.preventDefault();
          setHighlightedIndex(filteredOptions.length - 1);
          break;
      }
    };

    const handleOptionClick = (
      event: MouseEvent<HTMLLIElement>,
      optionValue: string
    ) => {
      event.preventDefault();
      event.stopPropagation();
      handleSelect(optionValue);
    };

    const handleClearSearch = (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setSearchTerm("");
      searchInputRef.current?.focus();
    };

    const sizeStyles = getSizeStyles();
    const variantStyles = getVariantStyles();

    // Chevron icon
    const ChevronIcon = () => (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        style={{
          position: "absolute",
          right: inputSize === "sm" ? "0.5rem" : "0.75rem",
          top: "50%",
          transform: `translateY(-50%) rotate(${isOpen ? "180deg" : "0deg"})`,
          transition: "transform 180ms ease-out",
          pointerEvents: "none",
        }}
      >
        <path
          d="M2.5 4.5L6 8L9.5 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

    // Checkmark icon
    const CheckIcon = () => (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M3 7L6 10L11 4"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

    // Clear icon for search
    const ClearIcon = () => (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M3 3L9 9M9 3L3 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );

    return (
      <div
        ref={containerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.375rem",
          width: "100%",
          position: "relative",
        }}
        className={className}
      >
        {label && (
          <label
            htmlFor={selectId}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: disabled ? "var(--color-ink-muted)" : "var(--color-ink-light)",
              letterSpacing: "0.01em",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {label}
          </label>
        )}

        {/* Trigger button */}
        <button
          ref={ref}
          type="button"
          id={selectId}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && highlightedIndex >= 0
              ? `${selectId}-option-${highlightedIndex}`
              : undefined
          }
          aria-invalid={hasError}
          aria-describedby={
            error
              ? `${selectId}-error`
              : hint
              ? `${selectId}-hint`
              : undefined
          }
          disabled={disabled}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            letterSpacing: "0.01em",
            color: selectedOption
              ? disabled
                ? "var(--color-ink-muted)"
                : "var(--color-ink)"
              : "var(--color-ink-muted)",
            border: "1px solid",
            borderRadius: 0,
            outline: "none",
            transition: "all 180ms ease-out",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.7 : 1,
            textAlign: "left",
            ...sizeStyles,
            ...variantStyles,
          }}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronIcon />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: "4px",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-lg)",
              zIndex: "var(--z-dropdown)",
              animation: "selectDropdownOpen 180ms ease-out",
              overflow: "hidden",
            }}
          >
            {/* Search input */}
            {isSearchable && (
              <div
                style={{
                  padding: "0.5rem",
                  borderBottom: "1px solid var(--color-border)",
                  position: "relative",
                }}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search..."
                  style={{
                    width: "100%",
                    padding: "0.5rem 2rem 0.5rem 0.75rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--color-ink)",
                    background: "var(--color-surface-dim)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 0,
                    outline: "none",
                    transition: "border-color 180ms ease-out",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-accent)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border)";
                  }}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: "0.25rem",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--color-ink-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label="Clear search"
                  >
                    <ClearIcon />
                  </button>
                )}
              </div>
            )}

            {/* Options list */}
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-label={label || "Options"}
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                maxHeight: "240px",
                overflowY: "auto",
              }}
            >
              {filteredOptions.length === 0 ? (
                <li
                  style={{
                    padding: "0.75rem 1rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--color-ink-muted)",
                    textAlign: "center",
                  }}
                >
                  No options found
                </li>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = option.value === value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <li
                      key={option.value}
                      id={`${selectId}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={(e) => handleOptionClick(e, option.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                        padding: "0.625rem 1rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.875rem",
                        color: isSelected
                          ? "var(--color-ink)"
                          : "var(--color-ink)",
                        fontWeight: isSelected ? 500 : 400,
                        background: isHighlighted
                          ? "var(--color-surface-dim)"
                          : "transparent",
                        cursor: "pointer",
                        transition: "background 100ms ease-out",
                      }}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {option.label}
                      </span>
                      {isSelected && <CheckIcon />}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}

        {error && (
          <span
            id={`${selectId}-error`}
            role="alert"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "#C75050",
              letterSpacing: "0.01em",
            }}
          >
            {error}
          </span>
        )}
        {hint && !error && (
          <span
            id={`${selectId}-hint`}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 400,
              color: "var(--color-ink-muted)",
              letterSpacing: "0.01em",
            }}
          >
            {hint}
          </span>
        )}

        {/* Animation keyframes via style tag */}
        <style>{`
          @keyframes selectDropdownOpen {
            from {
              opacity: 0;
              transform: translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
