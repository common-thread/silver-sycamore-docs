"use client";

import { useState, FormEvent } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "@/components/ui/Select";

// Form field types matching the backend schema
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

export type FormField = {
  name: string;
  type: FormFieldType;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
};

export interface FormSchema {
  _id: string;
  formId: string;
  title: string;
  description?: string;
  fields: string; // JSON string of FormField[]
}

interface FormRendererProps {
  formSchema: FormSchema;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isSubmitting?: boolean;
}

/**
 * Parse form fields from JSON string.
 * Returns empty array on parse error.
 */
function parseFormFields(fieldsJson: string): FormField[] {
  try {
    const parsed = JSON.parse(fieldsJson);
    if (!Array.isArray(parsed)) return [];
    return parsed as FormField[];
  } catch {
    return [];
  }
}

export function FormRenderer({
  formSchema,
  onSubmit,
  isSubmitting = false,
}: FormRendererProps) {
  const fields = parseFormFields(formSchema.fields);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleMultiselectChange = (name: string, option: string, checked: boolean) => {
    const current = (formData[name] as string[]) || [];
    const updated = checked
      ? [...current, option]
      : current.filter((v) => v !== option);
    handleFieldChange(name, updated);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const field of fields) {
      if (field.required) {
        const value = formData[field.name];

        if (field.type === "checkbox") {
          // Checkbox required means it must be checked
          if (!value) {
            newErrors[field.name] = `${field.label} is required`;
          }
        } else if (field.type === "multiselect") {
          // Multiselect required means at least one option selected
          if (!value || (Array.isArray(value) && value.length === 0)) {
            newErrors[field.name] = `Please select at least one option`;
          }
        } else if (field.type === "file") {
          // File required means a file must be selected
          if (!value) {
            newErrors[field.name] = `Please select a file`;
          }
        } else {
          // Text fields - check for empty string or undefined
          if (value === undefined || value === null || value === "") {
            newErrors[field.name] = `${field.label} is required`;
          }
        }
      }

      // Email validation
      if (field.type === "email" && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name] as string)) {
          newErrors[field.name] = "Please enter a valid email address";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name];
    const error = errors[field.name];
    const labelWithRequired = field.required ? `${field.label} *` : field.label;

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <Input
            key={field.name}
            type={field.type}
            label={labelWithRequired}
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            error={error}
            disabled={isSubmitting}
          />
        );

      case "number":
        return (
          <Input
            key={field.name}
            type="number"
            label={labelWithRequired}
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            error={error}
            disabled={isSubmitting}
          />
        );

      case "date":
        return (
          <Input
            key={field.name}
            type="date"
            label={labelWithRequired}
            value={(value as string) || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            error={error}
            disabled={isSubmitting}
          />
        );

      case "time":
        return (
          <Input
            key={field.name}
            type="time"
            label={labelWithRequired}
            value={(value as string) || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            error={error}
            disabled={isSubmitting}
          />
        );

      case "textarea":
        return (
          <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
            <label
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-medium)",
                color: "var(--color-ink-light)",
                letterSpacing: "0.01em",
              }}
            >
              {labelWithRequired}
            </label>
            <textarea
              placeholder={field.placeholder}
              value={(value as string) || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              disabled={isSubmitting}
              rows={4}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                padding: "var(--space-3) var(--space-4)",
                border: `1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
                borderRadius: 0,
                background: "var(--color-surface)",
                color: "var(--color-ink)",
                resize: "vertical",
                outline: "none",
                transition: "border-color var(--duration-fast) var(--ease-out)",
                width: "100%",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-accent)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? "var(--color-error)" : "var(--color-border)";
              }}
            />
            {error && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: "var(--font-medium)",
                  color: "var(--color-error)",
                }}
              >
                {error}
              </span>
            )}
          </div>
        );

      case "select":
        const selectOptions = (field.options || []).map((opt) => ({
          value: opt,
          label: opt,
        }));
        return (
          <Select
            key={field.name}
            label={labelWithRequired}
            options={selectOptions}
            value={(value as string) || ""}
            onChange={(val) => handleFieldChange(field.name, val)}
            placeholder="Select an option..."
            disabled={isSubmitting}
            error={error}
            inputSize="md"
          />
        );

      case "multiselect":
        const selectedOptions = (value as string[]) || [];
        return (
          <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
            <label
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-medium)",
                color: "var(--color-ink-light)",
                letterSpacing: "0.01em",
              }}
            >
              {labelWithRequired}
            </label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                padding: "var(--space-3) var(--space-4)",
                border: `1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
                background: "var(--color-surface)",
              }}
            >
              {field.options?.map((option) => (
                <label
                  key={option}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-ink)",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={(e) => handleMultiselectChange(field.name, option, e.target.checked)}
                    disabled={isSubmitting}
                    style={{
                      width: "1rem",
                      height: "1rem",
                      accentColor: "var(--color-accent)",
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
            {error && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: "var(--font-medium)",
                  color: "var(--color-error)",
                }}
              >
                {error}
              </span>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-ink)",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                disabled={isSubmitting}
                style={{
                  width: "1.125rem",
                  height: "1.125rem",
                  accentColor: "var(--color-accent)",
                }}
              />
              {labelWithRequired}
            </label>
            {error && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: "var(--font-medium)",
                  color: "var(--color-error)",
                }}
              >
                {error}
              </span>
            )}
          </div>
        );

      case "file":
        return (
          <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
            <label
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-medium)",
                color: "var(--color-ink-light)",
                letterSpacing: "0.01em",
              }}
            >
              {labelWithRequired}
            </label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Convert to base64 for storage
                  const reader = new FileReader();
                  reader.onload = () => {
                    handleFieldChange(field.name, {
                      name: file.name,
                      type: file.type,
                      size: file.size,
                      data: reader.result,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              disabled={isSubmitting}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                padding: "0.5rem",
                border: `1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
                background: "var(--color-surface)",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                width: "100%",
              }}
            />
            {typeof value === "object" && value !== null && "name" in value && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  color: "var(--color-ink-muted)",
                }}
              >
                Selected: {(value as { name: string }).name}
              </span>
            )}
            {error && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: "var(--font-medium)",
                  color: "var(--color-error)",
                }}
              >
                {error}
              </span>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      {/* Form Header */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            fontWeight: 600,
            color: "var(--color-ink)",
            marginBottom: "0.5rem",
            letterSpacing: "var(--tracking-snug)",
          }}
        >
          {formSchema.title}
        </h1>
        {formSchema.description && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--color-ink-light)",
              lineHeight: 1.6,
            }}
          >
            {formSchema.description}
          </p>
        )}
      </div>

      {/* Form Fields */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        {fields.map(renderField)}
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: "var(--space-8)", display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
