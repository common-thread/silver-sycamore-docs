"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";
import { FormField, FormFieldType } from "./FormRenderer";

// Simple icon components to avoid external deps for now
const ChevronUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;

interface FormBuilderProps {
    formId: Id<"formSchemas">;
    initialTitle: string;
    initialDescription?: string;
    initialFields: FormField[];
    initialCategory: string;
}

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
    { value: "text", label: "Short Text" },
    { value: "textarea", label: "Long Text" },
    { value: "number", label: "Number" },
    { value: "email", label: "Email" },
    { value: "tel", label: "Phone" },
    { value: "date", label: "Date" },
    { value: "time", label: "Time" },
    { value: "select", label: "Dropdown" },
    { value: "multiselect", label: "Multi-Select" },
    { value: "checkbox", label: "Checkbox" },
    { value: "file", label: "File Upload" },
];

export default function FormBuilder({
    formId,
    initialTitle,
    initialDescription,
    initialFields,
    initialCategory,
}: FormBuilderProps) {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription || "");
    const [category, setCategory] = useState(initialCategory);
    const [fields, setFields] = useState<FormField[]>(initialFields);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const updateForm = useMutation(api.forms.update);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            await updateForm({
                id: formId,
                title,
                description,
                category,
                fields: JSON.stringify(fields),
            });
            setMessage({ type: "success", text: "Form saved successfully!" });
        } catch (error) {
            setMessage({ type: "error", text: "Failed to save form." });
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const addField = () => {
        const newField: FormField = {
            name: `field_${Date.now()}`,
            label: "New Field",
            type: "text",
            required: false,
        };
        setFields([...fields, newField]);
    };

    const updateField = (index: number, updates: Partial<FormField>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        setFields(newFields);
    };

    const removeField = (index: number) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };

    const moveField = (index: number, direction: "up" | "down") => {
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === fields.length - 1)
        ) {
            return;
        }
        const newFields = [...fields];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
        setFields(newFields);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header / Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 space-y-4">
                <h2 className="text-xl font-display font-semibold text-ink">Form Settings</h2>
                <Input
                    label="Form Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-stone-700">Description</label>
                    <textarea
                        className="w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all font-body text-ink"
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <Input
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
            </div>

            {/* Fields Editor */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-display font-semibold text-ink">Form Fields</h2>
                    <Button onClick={addField} variant="secondary" className="flex items-center gap-2">
                        <PlusIcon /> Add Field
                    </Button>
                </div>

                {fields.length === 0 && (
                    <div className="text-center py-10 bg-stone-50 rounded-lg border border-dashed border-stone-300 text-stone-500">
                        No fields yet. Click "Add Field" to start building.
                    </div>
                )}

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.name} className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 transition-all hover:border-stone-300">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Field Label"
                                        value={field.label}
                                        onChange={(e) => updateField(index, { label: e.target.value })}
                                    />
                                    <Select
                                        label="Type"
                                        value={field.type}
                                        options={FIELD_TYPES}
                                        onChange={(val) => updateField(index, { type: val as FormFieldType })}
                                    />
                                </div>
                                <div className="flex items-center gap-1 pt-6">
                                    <button
                                        onClick={() => moveField(index, "up")}
                                        className="p-1 hover:bg-stone-100 rounded text-stone-500 disabled:opacity-30"
                                        disabled={index === 0}
                                        aria-label={`Move ${field.label} field up`}
                                    >
                                        <ChevronUpIcon />
                                    </button>
                                    <button
                                        onClick={() => moveField(index, "down")}
                                        className="p-1 hover:bg-stone-100 rounded text-stone-500 disabled:opacity-30"
                                        disabled={index === fields.length - 1}
                                        aria-label={`Move ${field.label} field down`}
                                    >
                                        <ChevronDownIcon />
                                    </button>
                                    <button
                                        onClick={() => removeField(index)}
                                        className="p-1 hover:bg-red-50 text-red-500 rounded ml-2"
                                        aria-label={`Delete ${field.label} field`}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={(e) => updateField(index, { required: e.target.checked })}
                                        className="w-4 h-4 text-accent rounded focus:ring-accent"
                                    />
                                    Required Field
                                </label>

                                {/* Options Editor for Select/Multiselect */}
                                {(field.type === 'select' || field.type === 'multiselect') && (
                                    <div className="flex-1">
                                        <Input
                                            label="Options (comma separated)"
                                            value={field.options?.join(', ') || ''}
                                            placeholder="Option 1, Option 2, Option 3"
                                            onChange={(e) => updateField(index, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                        />
                                    </div>
                                )}

                                {/* Placeholder for inputs */}
                                {(field.type === 'text' || field.type === 'textarea' || field.type === 'email' || field.type === 'tel' || field.type === 'number') && (
                                    <div className="flex-1">
                                        <Input
                                            label="Placeholder (Optional)"
                                            value={field.placeholder || ''}
                                            onChange={(e) => updateField(index, { placeholder: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-6 bg-white p-4 rounded-lg shadow-lg border border-stone-200 flex items-center justify-between z-10">
                <div className="text-sm font-medium">
                    {message && (
                        <span className={message.type === 'success' ? 'text-green-600' : 'text-red-600'}>
                            {message.text}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
