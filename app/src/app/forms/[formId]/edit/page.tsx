"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import FormBuilder from "@/components/FormBuilder";
import { FormField } from "@/components/FormRenderer";
import { useRouter } from "next/navigation";

export default function EditFormPage({ params }: { params: Promise<{ formId: string }> }) {
    const resolvedParams = use(params);
    const formId = resolvedParams.formId as Id<"formSchemas">;

    const form = useQuery(api.forms.get, { id: formId });
    const [parsedFields, setParsedFields] = useState<FormField[]>([]);

    useEffect(() => {
        if (form?.fields) {
            try {
                const parsed = JSON.parse(form.fields);
                if (Array.isArray(parsed)) {
                    setParsedFields(parsed);
                }
            } catch (e) {
                console.error("Failed to parse form fields", e);
            }
        }
    }, [form]);

    if (form === undefined) {
        return <div className="p-8 text-center text-stone-500">Loading form...</div>;
    }

    if (form === null) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl font-bold text-red-600">Form not found</h1>
                <Link href="/forms" className="text-stone-600 hover:underline mt-4 block">Return to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="bg-stone-50 min-h-screen">
            {/* Editor Header */}
            <div className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href="/forms" className="text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium text-sm">
                        ← Back to Dashboard
                    </Link>
                    <div className="h-6 w-px bg-stone-200"></div>
                    <span className="font-semibold text-ink">{form.title}</span>
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full uppercase tracking-wider hidden sm:inline-block">
                        Editor
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/f/${form.formId}`}
                        target="_blank"
                        className="text-stone-600 hover:text-accent font-medium text-sm flex items-center gap-1"
                    >
                        Live Preview ↗
                    </Link>
                </div>
            </div>

            <FormBuilder
                formId={formId}
                initialTitle={form.title}
                initialDescription={form.description}
                initialFields={parsedFields}
                initialCategory={form.category}
            />
        </div>
    );
}
