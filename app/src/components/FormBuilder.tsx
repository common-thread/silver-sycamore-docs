"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "@/components/ui/Select";

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Import DraggableFieldCard and shared types
import {
  DraggableFieldCard,
  FormField,
  slugify,
} from "./DraggableFieldCard";

interface FormBuilderProps {
  formId?: Id<"formSchemas">;
  onSave?: () => void;
  onCancel?: () => void;
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

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Add new field (creates default field and expands for editing)
  const handleAddField = () => {
    const newField: FormField = {
      name: `field_${Date.now()}`, // Temporary unique name
      type: "text",
      label: "",
      required: false,
    };
    setFields([...fields, newField]);
    setEditingFieldIndex(fields.length); // Expand the new field for editing
  };

  // Start editing a field
  const handleStartEdit = (index: number) => {
    setEditingFieldIndex(index);
  };

  // Save field changes (DraggableFieldCard handles validation)
  const handleFieldSave = (index: number, updatedField: FormField) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    setFields(newFields);
    setEditingFieldIndex(null);
  };

  // Delete a field
  const handleDeleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
    // Adjust editingFieldIndex if needed
    if (editingFieldIndex !== null) {
      if (editingFieldIndex === index) {
        setEditingFieldIndex(null);
      } else if (editingFieldIndex > index) {
        setEditingFieldIndex(editingFieldIndex - 1);
      }
    }
  };

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((f) => f.name === active.id);
        const newIndex = items.findIndex((f) => f.name === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });

      // Adjust editingFieldIndex if it's affected by the reorder
      if (editingFieldIndex !== null) {
        const oldEditingField = fields[editingFieldIndex];
        if (oldEditingField) {
          const newEditingIndex = fields.findIndex((f) => f.name === oldEditingField.name);
          if (newEditingIndex !== editingFieldIndex) {
            // The editing field moved, but we keep it expanded
            // The index will be recalculated on next render
          }
        }
      }
    }
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
          padding: "var(--space-8)",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
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
          padding: "var(--space-8)",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          color: "var(--color-ink-muted)",
        }}
      >
        Form not found
      </div>
    );
  }

  // Get existing field names for uniqueness validation
  const existingFieldNames = fields.map((f) => f.name);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Form Details Section */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          padding: "var(--space-6)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-base)",
            fontWeight: "var(--font-semibold)",
            color: "var(--color-ink)",
            margin: "0 0 var(--space-4) 0",
            paddingBottom: "var(--space-3)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          Form Details
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
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
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-medium)",
                color: "var(--color-ink-light)",
                marginBottom: "var(--space-1)",
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
                padding: "var(--space-3) var(--space-4)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-ink)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 0,
                outline: "none",
                resize: "vertical",
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
          padding: "var(--space-6)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--space-4)",
            paddingBottom: "var(--space-3)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-base)",
              fontWeight: "var(--font-semibold)",
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
            disabled={editingFieldIndex !== null}
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

        {/* Field List with Drag-and-Drop */}
        {fields.length === 0 ? (
          <div
            style={{
              padding: "var(--space-8)",
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--color-ink-muted)",
              border: "1px dashed var(--color-border)",
            }}
          >
            No fields yet. Click "Add Field" to get started.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((f) => f.name)}
              strategy={verticalListSortingStrategy}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {fields.map((field, index) => (
                  <DraggableFieldCard
                    key={field.name}
                    field={field}
                    index={index}
                    isEditing={editingFieldIndex === index}
                    onStartEdit={() => handleStartEdit(index)}
                    onSave={(updatedField) => handleFieldSave(index, updatedField)}
                    onDelete={() => handleDeleteField(index)}
                    existingFieldNames={existingFieldNames.filter((_, i) => i !== index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-error-bg)",
            border: "1px solid var(--color-error-border)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
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
          gap: "var(--space-3)",
          paddingTop: "var(--space-2)",
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
