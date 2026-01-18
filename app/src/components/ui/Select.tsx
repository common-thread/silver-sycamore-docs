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

    // Build trigger classes
    const sizeClass = `select-${inputSize}`;
    const variantClass = variant === "filled" ? "select-filled" : "";
    const openClass = isOpen ? "select-trigger-open" : "";
    const errorClass = hasError ? "select-trigger-error" : "";
    const placeholderClass = !selectedOption ? "select-trigger-placeholder" : "";
    const triggerClasses = [
      "select-trigger",
      sizeClass,
      variantClass,
      openClass,
      errorClass,
      placeholderClass,
    ]
      .filter(Boolean)
      .join(" ");

    // Build label classes
    const labelClasses = [
      "select-label",
      disabled ? "select-label-disabled" : "",
    ]
      .filter(Boolean)
      .join(" ");

    // Build chevron classes
    const chevronClasses = [
      "select-chevron",
      isOpen ? "select-chevron-open" : "",
      inputSize === "sm" ? "select-chevron-sm" : "",
    ]
      .filter(Boolean)
      .join(" ");

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

    // Chevron icon
    const ChevronIcon = () => (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className={chevronClasses}
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
      <div ref={containerRef} className={`select-wrapper ${className}`}>
        {label && (
          <label htmlFor={selectId} className={labelClasses}>
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
          className={triggerClasses}
        >
          <span className="select-value">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronIcon />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="select-dropdown">
            {/* Search input */}
            {isSearchable && (
              <div className="select-search">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search..."
                  className="select-search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="select-search-clear"
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
              className="select-options"
            >
              {filteredOptions.length === 0 ? (
                <li className="select-empty">No options found</li>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = option.value === value;
                  const isHighlighted = index === highlightedIndex;

                  const optionClasses = [
                    "select-option",
                    isHighlighted ? "select-option-highlighted" : "",
                    isSelected ? "select-option-selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <li
                      key={option.value}
                      id={`${selectId}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={(e) => handleOptionClick(e, option.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={optionClasses}
                    >
                      <span className="select-option-label">{option.label}</span>
                      {isSelected && <CheckIcon />}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}

        {error && (
          <span id={`${selectId}-error`} role="alert" className="input-error-text">
            {error}
          </span>
        )}
        {hint && !error && (
          <span id={`${selectId}-hint`} className="input-hint">
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
