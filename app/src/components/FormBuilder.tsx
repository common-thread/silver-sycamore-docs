"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "@/components/ui/Select";
import { FieldEditor } from "./FieldEditor";

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

interface FormBuilderProps {
  formId?: Id<"formSchemas">;
  onSave?: () => void;
  onCancel?: () => void;
}

// Helper to generate unique field name from label
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 50);
}

// Generate unique formId for new forms
function generateFormId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `form_${timestamp}_${random}`;
}

export function FormBuilder({ formId, onSave, onCancel }: FormBuilderProps) {
  const router = useRouter();

  // Fetch existing form for edit mode
  const existingForm = useQuery(
    api.forms.get,
    formId ? { id: formId } : "skip"
  );

  // Mutations
  const createForm = useMutation(api.forms.create);
  const updateForm = useMutation(api.forms.update);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [fields, setFields] = useState<FormField[]>([]);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);

  // Initialize form from existing data
  useEffect(() => {
    if (existingForm) {
      setTitle(existingForm.title);
      setDescription(existingForm.description || "");
      setCategory(existingForm.category);

      // Parse fields from JSON string
      try {
        const parsedFields = JSON.parse(existingForm.fields);
        setFields(parsedFields);
      } catch {
        setFields([]);
      }
    }
  }, [existingForm]);

  const handleAddField = () => {
    setIsAddingField(true);
    setEditingFieldIndex(null);
  };

  const handleEditField = (index: number) => {
    setEditingFieldIndex(index);
    setIsAddingField(false);
  };

  const handleDeleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleMoveField = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const newFields = [...fields];
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    setFields(newFields);
  };

  const handleFieldSave = (field: FormField) => {
    if (isAddingField) {
      // Adding new field - ensure unique name
      let fieldName = field.name;
      let counter = 1;
      while (fields.some((f) => f.name === fieldName)) {
        fieldName = `${field.name}_${counter}`;
        counter++;
      }
      setFields([...fields, { ...field, name: fieldName }]);
      setIsAddingField(false);
    } else if (editingFieldIndex !== null) {
      // Editing existing field
      const newFields = [...fields];
      // Ensure name uniqueness (except for current field)
      let fieldName = field.name;
      let counter = 1;
      while (fields.some((f, i) => i !== editingFieldIndex && f.name === fieldName)) {
        fieldName = `${field.name}_${counter}`;
        counter++;
      }
      newFields[editingFieldIndex] = { ...field, name: fieldName };
      setFields(newFields);
      setEditingFieldIndex(null);
    }
  };

  const handleFieldCancel = () => {
    setIsAddingField(false);
    setEditingFieldIndex(null);
  };

  const handleSave = async (asDraft: boolean = true) => {
    if (!title.trim()) {
      setError("Form title is required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const fieldsJson = JSON.stringify(fields);

      if (formId) {
        // Update existing form
        await updateForm({
          id: formId,
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          fields: fieldsJson,
          status: asDraft ? "draft" : "active",
        });
      } else {
        // Create new form
        await createForm({
          formId: generateFormId(),
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          fields: fieldsJson,
        });
      }

      onSave?.();
      router.push("/forms");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save form");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    router.push("/forms");
  };

  // Loading state for edit mode
  if (formId && existingForm === undefined) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-muted)",
        }}
      >
        Loading form...
      </div>
    );
  }

  if (formId && existingForm === null) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--color-ink-muted)",
        }}
      >
        Form not found
      </div>
    );
  }

  const currentEditingField = editingFieldIndex !== null ? fields[editingFieldIndex] : null;
  const existingFieldNames = fields.map((f) => f.name);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Form Details Section */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          padding: "1.5rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--color-ink)",
            margin: "0 0 1rem 0",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          Form Details
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter form title"
          />

          <div>
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
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this form..."
              rows={3}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--color-ink)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 0,
                outline: "none",
                resize: "vertical",
                transition: "border-color 150ms ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            />
          </div>

          <Select
            label="Category"
            options={[
              { value: "general", label: "General" },
              { value: "client_intake", label: "Client Intake" },
              { value: "event_planning", label: "Event Planning" },
              { value: "feedback", label: "Feedback" },
              { value: "internal", label: "Internal" },
            ]}
            value={category}
            onChange={(val) => setCategory(val)}
            inputSize="md"
          />
        </div>
      </div>

      {/* Fields Section */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            Fields
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddField}
            disabled={isAddingField || editingFieldIndex !== null}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 2V12M2 7H12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Add Field
          </Button>
        </div>

        {/* Field List */}
        {fields.length === 0 && !isAddingField ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ink-muted)",
              border: "1px dashed var(--color-border)",
            }}
          >
            No fields yet. Click "Add Field" to get started.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {fields.map((field, index) => (
              <div
                key={field.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  background: "var(--color-surface-dim, #F8F8F6)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {/* Move buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <button
                    onClick={() => handleMoveField(index, "up")}
                    disabled={index === 0}
                    style={{
                      padding: "2px",
                      background: "transparent",
                      border: "none",
                      cursor: index === 0 ? "not-allowed" : "pointer",
                      color: index === 0 ? "var(--color-ink-muted)" : "var(--color-ink-light)",
                      opacity: index === 0 ? 0.3 : 1,
                    }}
                    title="Move up"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 3L10 7H2L6 3Z" fill="currentColor" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleMoveField(index, "down")}
                    disabled={index === fields.length - 1}
                    style={{
                      padding: "2px",
                      background: "transparent",
                      border: "none",
                      cursor: index === fields.length - 1 ? "not-allowed" : "pointer",
                      color: index === fields.length - 1 ? "var(--color-ink-muted)" : "var(--color-ink-light)",
                      opacity: index === fields.length - 1 ? 0.3 : 1,
                    }}
                    title="Move down"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 9L2 5H10L6 9Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                {/* Field info */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      color: "var(--color-ink)",
                    }}
                  >
                    {field.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "var(--color-ink-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.125rem 0.375rem",
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "2px",
                        fontSize: "0.6875rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {field.type}
                    </span>
                    {field.required && (
                      <span
                        style={{
                          padding: "0.125rem 0.375rem",
                          background: "var(--color-error-bg)",
                          color: "var(--color-error)",
                          borderRadius: "2px",
                          fontSize: "0.6875rem",
                          fontWeight: 500,
                        }}
                      >
                        Required
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <button
                  onClick={() => handleEditField(index)}
                  style={{
                    padding: "0.5rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-ink-light)",
                  }}
                  title="Edit field"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteField(index)}
                  style={{
                    padding: "0.5rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-error)",
                  }}
                  title="Delete field"
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
            ))}
          </div>
        )}

        {/* Field Editor Dialog */}
        {(isAddingField || editingFieldIndex !== null) && (
          <FieldEditor
            field={currentEditingField || undefined}
            existingFieldNames={
              editingFieldIndex !== null
                ? existingFieldNames.filter((_, i) => i !== editingFieldIndex)
                : existingFieldNames
            }
            onSave={handleFieldSave}
            onCancel={handleFieldCancel}
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "var(--color-error-bg)",
            border: "1px solid var(--color-error-border)",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-error)",
          }}
        >
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "0.75rem",
          paddingTop: "0.5rem",
        }}
      >
        <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleSave(true)}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Draft"}
        </Button>
        <Button
          variant="primary"
          onClick={() => handleSave(false)}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
