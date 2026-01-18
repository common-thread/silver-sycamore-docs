"use client";

import { useState, useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Input from "./ui/Input";
import Select from "@/components/ui/Select";
import Button from "./ui/Button";

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
  // Local editing state
  const [editLabel, setEditLabel] = useState(field.label);
  const [editType, setEditType] = useState<FormFieldType>(field.type);
  const [editPlaceholder, setEditPlaceholder] = useState(field.placeholder || "");
  const [editRequired, setEditRequired] = useState(field.required);
  const [editOptions, setEditOptions] = useState<string[]>(field.options || []);
  const [error, setError] = useState<string | null>(null);

  const labelInputRef = useRef<HTMLInputElement>(null);

  // Reset local state when field changes (external update)
  useEffect(() => {
    if (!isEditing) {
      setEditLabel(field.label);
      setEditType(field.type);
      setEditPlaceholder(field.placeholder || "");
      setEditRequired(field.required);
      setEditOptions(field.options || []);
      setError(null);
    }
  }, [field, isEditing]);

  // Auto-focus label input when editing starts
  useEffect(() => {
    if (isEditing && labelInputRef.current) {
      labelInputRef.current.focus();
      labelInputRef.current.select();
    }
  }, [isEditing]);

  // dnd-kit sortable hook
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
    transition: transition || "transform var(--duration-fast) var(--ease-default)",
  };

  // Handle save
  const handleSave = () => {
    // Validation
    if (!editLabel.trim()) {
      setError("Label is required");
      return;
    }

    // Check for select/multiselect options
    if ((editType === "select" || editType === "multiselect")) {
      const validOptions = editOptions.filter((o) => o.trim());
      if (validOptions.length === 0) {
        setError("At least one option is required for dropdown fields");
        return;
      }
    }

    // Generate new name from label
    const newName = slugify(editLabel);

    // Check name uniqueness (excluding current field's name)
    const otherNames = existingFieldNames.filter((n) => n !== field.name);
    let finalName = newName;
    let counter = 1;
    while (otherNames.includes(finalName)) {
      finalName = `${newName}_${counter}`;
      counter++;
    }

    const updatedField: FormField = {
      name: finalName,
      type: editType,
      label: editLabel.trim(),
      required: editRequired,
    };

    if (editPlaceholder.trim()) {
      updatedField.placeholder = editPlaceholder.trim();
    }

    if ((editType === "select" || editType === "multiselect") && editOptions.length > 0) {
      updatedField.options = editOptions.filter((o) => o.trim());
    }

    setError(null);
    onSave(updatedField);
  };

  // Handle adding option
  const handleAddOption = () => {
    setEditOptions([...editOptions, ""]);
  };

  // Handle updating option
  const handleUpdateOption = (idx: number, value: string) => {
    const newOptions = [...editOptions];
    newOptions[idx] = value;
    setEditOptions(newOptions);
  };

  // Handle removing option
  const handleRemoveOption = (idx: number) => {
    setEditOptions(editOptions.filter((_, i) => i !== idx));
  };

  // Show options editor for select/multiselect
  const showOptionsEditor = editType === "select" || editType === "multiselect";

  // ============================================================================
  // Render Collapsed State
  // ============================================================================
  if (!isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          opacity: isDragging ? 0.5 : 1,
        }}
        {...attributes}
      >
        <div
          onClick={onStartEdit}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            cursor: "pointer",
            transition: "border-color var(--duration-fast) var(--ease-default)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
          }}
        >
          {/* Drag handle */}
          <button
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: "var(--space-1)",
              background: "transparent",
              border: "none",
              cursor: isDragging ? "grabbing" : "grab",
              color: "var(--color-ink-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
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

          {/* Field label */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-medium)",
                color: "var(--color-ink)",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {field.label}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                color: "var(--color-ink-muted)",
              }}
            >
              Click to edit...
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
              flexShrink: 0,
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
                flexShrink: 0,
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
              flexShrink: 0,
              transition: "color var(--duration-fast) var(--ease-default)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-error)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-ink-muted)";
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

  // ============================================================================
  // Render Expanded (Editing) State
  // ============================================================================
  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
    >
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-accent)",
          transition: "border-color var(--duration-fast) var(--ease-default)",
        }}
      >
        {/* Header with drag handle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-3) var(--space-4)",
            borderBottom: "1px solid var(--color-border)",
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
              flexShrink: 0,
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

          {/* Label input */}
          <div style={{ flex: 1 }}>
            <input
              ref={labelInputRef}
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              placeholder="Field label"
              style={{
                width: "100%",
                padding: "var(--space-2) var(--space-3)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-medium)",
                color: "var(--color-ink)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                outline: "none",
                transition: "border-color var(--duration-fast) var(--ease-default)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            />
          </div>
        </div>

        {/* Editing form */}
        <div
          style={{
            padding: "var(--space-4)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          {/* Type selection */}
          <Select
            label="Type"
            options={FIELD_TYPES}
            value={editType}
            onChange={(val) => setEditType(val as FormFieldType)}
            inputSize="md"
            searchable
          />

          {/* Placeholder */}
          <Input
            label="Placeholder (optional)"
            value={editPlaceholder}
            onChange={(e) => setEditPlaceholder(e.target.value)}
            placeholder="e.g., Enter your answer..."
          />

          {/* Required checkbox */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={editRequired}
              onChange={(e) => setEditRequired(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                accentColor: "var(--color-accent)",
                cursor: "pointer",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-ink)",
              }}
            >
              Required field
            </span>
          </label>

          {/* Options editor for select/multiselect */}
          {showOptionsEditor && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "var(--space-2)",
                }}
              >
                <label
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-medium)",
                    color: "var(--color-ink-light)",
                  }}
                >
                  Options
                </label>
                <button
                  type="button"
                  onClick={handleAddOption}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-1)",
                    padding: "var(--space-1) var(--space-2)",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-medium)",
                    color: "var(--color-accent)",
                    background: "transparent",
                    border: "1px solid var(--color-accent)",
                    cursor: "pointer",
                    transition: "background var(--duration-fast) var(--ease-default)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-accent-bg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 2V10M2 6H10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Add
                </button>
              </div>

              {editOptions.length === 0 ? (
                <div
                  style={{
                    padding: "var(--space-3)",
                    textAlign: "center",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-ink-muted)",
                    border: "1px dashed var(--color-border)",
                  }}
                >
                  No options yet. Click "Add" to add choices.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                  {editOptions.map((option, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                      }}
                    >
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleUpdateOption(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        style={{
                          flex: 1,
                          padding: "var(--space-2) var(--space-3)",
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--text-sm)",
                          color: "var(--color-ink)",
                          background: "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                          outline: "none",
                          transition: "border-color var(--duration-fast) var(--ease-default)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "var(--color-accent)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "var(--color-border)";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        style={{
                          padding: "var(--space-1)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--color-ink-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "color var(--duration-fast) var(--ease-default)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--color-error)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--color-ink-muted)";
                        }}
                        aria-label="Remove option"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M3 3L11 11M11 3L3 11"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div
              style={{
                padding: "var(--space-2) var(--space-3)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                color: "var(--color-error)",
                background: "var(--color-error-bg)",
                border: "1px solid var(--color-error-border)",
              }}
            >
              {error}
            </div>
          )}

          {/* Done button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
