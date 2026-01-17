"use client";

import { useState, useEffect } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "@/components/ui/Select";

// Type definitions matching forms.ts
type FormFieldType =
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

interface FormField {
  name: string;
  type: FormFieldType;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface FieldEditorProps {
  field?: FormField;
  existingFieldNames: string[];
  onSave: (field: FormField) => void;
  onCancel: () => void;
}

// Helper to generate unique field name from label
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 50);
}

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
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

export function FieldEditor({
  field,
  existingFieldNames,
  onSave,
  onCancel,
}: FieldEditorProps) {
  // Form state
  const [label, setLabel] = useState(field?.label || "");
  const [name, setName] = useState(field?.name || "");
  const [type, setType] = useState<FormFieldType>(field?.type || "text");
  const [required, setRequired] = useState(field?.required || false);
  const [options, setOptions] = useState<string[]>(field?.options || []);
  const [placeholder, setPlaceholder] = useState(field?.placeholder || "");

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [autoGenerateName, setAutoGenerateName] = useState(!field);

  // Auto-generate name from label
  useEffect(() => {
    if (autoGenerateName && label) {
      setName(slugify(label));
    }
  }, [label, autoGenerateName]);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Validation
    if (!label.trim()) {
      setError("Field label is required");
      return;
    }

    if (!name.trim()) {
      setError("Field name is required");
      return;
    }

    // Check name uniqueness
    if (existingFieldNames.includes(name)) {
      setError("Field name must be unique");
      return;
    }

    // Validate options for select/multiselect
    if ((type === "select" || type === "multiselect")) {
      const validOptions = options.filter((o) => o.trim());
      if (validOptions.length === 0) {
        setError("At least one option is required for dropdown fields");
        return;
      }
    }

    setError(null);

    const fieldData: FormField = {
      name: name.trim(),
      type,
      label: label.trim(),
      required,
    };

    if (placeholder.trim()) {
      fieldData.placeholder = placeholder.trim();
    }

    if ((type === "select" || type === "multiselect") && options.length > 0) {
      fieldData.options = options.filter((o) => o.trim());
    }

    onSave(fieldData);
  };

  const showOptionsEditor = type === "select" || type === "multiselect";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(20, 20, 20, 0.5)",
        }}
      />

      {/* Dialog */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          margin: "1rem",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 8px 32px rgba(20, 20, 20, 0.2)",
          overflow: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: "var(--color-surface)",
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            {field ? "Edit Field" : "Add Field"}
          </h2>
          <button
            onClick={onCancel}
            style={{
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--color-ink-muted)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: "1.5rem" }}>
          {/* Label field */}
          <div style={{ marginBottom: "1.25rem" }}>
            <Input
              label="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Full Name, Email Address"
            />
          </div>

          {/* Field name */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--color-ink-light)",
                marginBottom: "0.375rem",
              }}
            >
              Field Name
            </label>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setAutoGenerateName(false);
                }}
                placeholder="e.g., full_name, email_address"
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--color-ink)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 0,
                  outline: "none",
                }}
              />
            </div>
            <div
              style={{
                marginTop: "0.25rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--color-ink-muted)",
              }}
            >
              {autoGenerateName
                ? "Auto-generated from label"
                : "Used for data storage (no spaces)"}
            </div>
          </div>

          {/* Type selection */}
          <div style={{ marginBottom: "1.25rem" }}>
            <Select
              label="Type"
              options={FIELD_TYPES}
              value={type}
              onChange={(val) => setType(val as FormFieldType)}
              inputSize="md"
              searchable
            />
          </div>

          {/* Placeholder */}
          <div style={{ marginBottom: "1.25rem" }}>
            <Input
              label="Placeholder (optional)"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="e.g., Enter your name..."
            />
          </div>

          {/* Required checkbox */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
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
                  fontSize: "0.9375rem",
                  color: "var(--color-ink)",
                }}
              >
                Required field
              </span>
            </label>
          </div>

          {/* Options editor for select/multiselect */}
          {showOptionsEditor && (
            <div style={{ marginBottom: "1.25rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <label
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
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
                    gap: "0.25rem",
                    padding: "0.375rem 0.625rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--color-accent)",
                    background: "transparent",
                    border: "1px solid var(--color-accent)",
                    borderRadius: 0,
                    cursor: "pointer",
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
                  Add Option
                </button>
              </div>

              {options.length === 0 ? (
                <div
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--color-ink-muted)",
                    border: "1px dashed var(--color-border)",
                  }}
                >
                  No options yet. Click "Add Option" to add choices.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {options.map((option, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleUpdateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        style={{
                          flex: 1,
                          padding: "0.5rem 0.75rem",
                          fontFamily: "var(--font-body)",
                          fontSize: "0.875rem",
                          color: "var(--color-ink)",
                          background: "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                          borderRadius: 0,
                          outline: "none",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        style={{
                          padding: "0.5rem",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--color-error)",
                        }}
                        title="Remove option"
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
                padding: "0.75rem 1rem",
                marginBottom: "1rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "var(--color-error)",
                background: "var(--color-error-bg)",
                border: "1px solid var(--color-error-border)",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            position: "sticky",
            bottom: 0,
            background: "var(--color-surface)",
          }}
        >
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {field ? "Save Field" : "Add Field"}
          </Button>
        </div>
      </div>
    </div>
  );
}
