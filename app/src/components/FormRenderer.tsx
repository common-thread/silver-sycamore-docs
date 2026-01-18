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
          <div key={field.name} className="flex flex-col gap-1 w-full">
            <label className="form-label">{labelWithRequired}</label>
            <textarea
              placeholder={field.placeholder}
              value={(value as string) || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className={`form-textarea ${error ? "form-textarea-error" : ""}`}
            />
            {error && <span className="form-error">{error}</span>}
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
          <div key={field.name} className="flex flex-col gap-1 w-full">
            <label className="form-label">{labelWithRequired}</label>
            <div className={`form-input ${error ? "form-input-error" : ""}`} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {field.options?.map((option) => (
                <label
                  key={option}
                  className="list-item-title"
                  style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: isSubmitting ? "not-allowed" : "pointer", fontWeight: "normal" }}
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={(e) => handleMultiselectChange(field.name, option, e.target.checked)}
                    disabled={isSubmitting}
                    style={{ width: "var(--space-4)", height: "var(--space-4)", accentColor: "var(--color-accent)" }}
                  />
                  {option}
                </label>
              ))}
            </div>
            {error && <span className="form-error">{error}</span>}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.name} className="flex flex-col gap-1 w-full">
            <label
              className="list-item-title"
              style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: isSubmitting ? "not-allowed" : "pointer", fontWeight: "normal" }}
            >
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                disabled={isSubmitting}
                style={{ width: "var(--space-5)", height: "var(--space-5)", accentColor: "var(--color-accent)" }}
              />
              {labelWithRequired}
            </label>
            {error && <span className="form-error">{error}</span>}
          </div>
        );

      case "file":
        return (
          <div key={field.name} className="flex flex-col gap-1 w-full">
            <label className="form-label">{labelWithRequired}</label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
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
              className={`form-input ${error ? "form-input-error" : ""}`}
              style={{ cursor: isSubmitting ? "not-allowed" : "pointer" }}
            />
            {typeof value === "object" && value !== null && "name" in value && (
              <span className="form-helper">Selected: {(value as { name: string }).name}</span>
            )}
            {error && <span className="form-error">{error}</span>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-renderer">
      {/* Form Header */}
      <div className="form-renderer-header">
        <h1 className="form-renderer-title">{formSchema.title}</h1>
        {formSchema.description && (
          <p className="form-renderer-description">{formSchema.description}</p>
        )}
      </div>

      {/* Form Fields */}
      <div className="form-renderer-fields">{fields.map(renderField)}</div>

      {/* Submit Button */}
      <div className="form-renderer-actions">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
