"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ============================================================================
// Shared Type Definitions (exported for FormBuilder)
// ============================================================================

export type FormFieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "time"
  | "email"
  | "tel"
  | "select"
  | "multiselect"
  | "checkbox"
  | "file";

export interface FormField {
  name: string;
  type: FormFieldType;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Long Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "select", label: "Dropdown" },
  { value: "multiselect", label: "Multi-select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "file", label: "File Upload" },
];

// Helper to generate unique field name from label
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 50);
}

// ============================================================================
// DraggableFieldCard Component
// ============================================================================

interface DraggableFieldCardProps {
  field: FormField;
  index: number;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: (field: FormField) => void;
  onDelete: () => void;
  existingFieldNames: string[];
}

export function DraggableFieldCard({
  field,
  index,
  isEditing,
  onStartEdit,
  onSave,
  onDelete,
  existingFieldNames,
}: DraggableFieldCardProps) {
  // Placeholder: Full implementation in Task 2
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
    >
      {/* Placeholder structure - will be fully implemented in Task 2 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
          padding: "var(--space-3) var(--space-4)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Drag handle */}
        <button
          {...listeners}
          style={{
            padding: "var(--space-1)",
            background: "transparent",
            border: "none",
            cursor: isDragging ? "grabbing" : "grab",
            color: "var(--color-ink-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Drag to reorder"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M5 4H5.01M5 8H5.01M5 12H5.01M11 4H11.01M11 8H11.01M11 12H11.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Field info */}
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-medium)",
              color: "var(--color-ink)",
            }}
          >
            {field.label}
          </span>
        </div>

        {/* Type badge */}
        <span
          style={{
            padding: "var(--space-px) var(--space-2)",
            background: "var(--color-surface-dim)",
            border: "1px solid var(--color-border)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            color: "var(--color-ink-muted)",
          }}
        >
          {field.type}
        </span>

        {/* Required indicator */}
        {field.required && (
          <span
            style={{
              padding: "var(--space-px) var(--space-2)",
              background: "var(--color-error-bg)",
              color: "var(--color-error)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-medium)",
            }}
          >
            Req
          </span>
        )}

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            padding: "var(--space-1)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--color-ink-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Delete field"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
