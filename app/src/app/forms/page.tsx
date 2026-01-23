"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import styles from "@/components/brand/brand.module.css";
import { LogoIcon } from "@/components/Logo";
import { Breadcrumb } from "@/components/Breadcrumb";

export default function FormsDashboard() {
    const forms = useQuery(api.forms.list);
    const createForm = useMutation(api.forms.create);
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);

    // Group forms by category
    const groupedForms = forms?.reduce((acc, form) => {
        const category = form.category || "Uncategorized";
        if (!acc[category]) acc[category] = [];
        acc[category].push(form);
        return acc;
    }, {} as Record<string, typeof forms>) || {};

    const handleCreate = async () => {
        setIsCreating(true);
        try {
            const formId = `form-${Date.now()}`;
            const newForm = await createForm({
                formId,
                title: "New Untitled Form",
                category: "general",
                fields: "[]",
            });
            if (newForm) {
                router.push(`/forms/${newForm}/edit`);
            }
        } catch (error) {
            console.error("Failed to create form:", error);
            setIsCreating(false);
        }
    };

    if (!forms) {
        return (
            <div className={styles.page}>
                <header className={styles.hero}>
                    <div className={styles.container}>
                        <div className="h-12 w-64 bg-border/20 rounded animate-pulse"></div>
                    </div>
                </header>
                <div className={styles.container}>
                    <div className="py-20 space-y-4">
                        <div className="h-8 bg-surface-subtle rounded w-full animate-pulse opacity-50"></div>
                        <div className="h-8 bg-surface-subtle rounded w-full animate-pulse opacity-30"></div>
                        <div className="h-8 bg-surface-subtle rounded w-full animate-pulse opacity-10"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.heroContent}>
                        <div style={{ marginBottom: "var(--space-2)" }}>
                            <Breadcrumb />
                        </div>
                        <h1 className={styles.heroTitle}>Forms Archive</h1>
                        <p className={styles.heroSubtitle}>
                            Master registry of all data collection instruments and surveys.
                        </p>
                    </div>
                    <div className="hidden md:flex justify-end items-end h-full w-full pb-2">
                        <Button onClick={handleCreate} disabled={isCreating} variant="primary">
                            {isCreating ? "Drafting..." : "Compose New"}
                        </Button>
                    </div>
                </div>
            </header>

            <div className={styles.container}>
                <div className="py-12 space-y-20">
                    {/* Mobile Create Button */}
                    <div className="md:hidden">
                        <Button onClick={handleCreate} disabled={isCreating} variant="primary" className="w-full">
                            Compose New Form
                        </Button>
                    </div>

                    {Object.entries(groupedForms).map(([category, categoryForms]) => (
                        <div key={category}>
                            <div className={styles.sectionHeader} style={{ marginBottom: "var(--space-8)" }}>
                                <span className={styles.eyebrow}>Category</span>
                                <h2 className={styles.sectionTitle} style={{ textTransform: 'capitalize' }}>
                                    {category.replace(/-/g, ' ')}
                                </h2>
                            </div>

                            <div className={styles.editorialList}>
                                {categoryForms?.map((form) => (
                                    <div key={form._id} className={styles.editorialItem}>
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                            <div className="flex-1">
                                                <Link href={`/forms/${form._id}/edit`} className="group">
                                                    <span className={styles.editorialTitle + " group-hover:text-accent transition-colors"}>
                                                        {form.title}
                                                    </span>
                                                </Link>
                                                <span className={styles.editorialDesc}>
                                                    {form.description || `Data collection instrument for ${category.replace(/-/g, ' ')}.`}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-6 mt-2 md:mt-0">
                                                {form.isPublished ? (
                                                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200/50">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted bg-stone-100 px-2 py-0.5 rounded border border-stone-200/50">
                                                        Draft
                                                    </span>
                                                )}
                                                <div className="flex gap-4">
                                                    <Link
                                                        href={`/forms/${form._id}/edit`}
                                                        className="text-xs font-bold uppercase tracking-widest text-ink hover:text-accent transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={`/f/${form.formId}`}
                                                        target="_blank"
                                                        className="text-xs font-bold uppercase tracking-widest text-ink-muted hover:text-ink transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {forms.length === 0 && (
                        <div className="text-center py-32 border-t border-border-subtle">
                            <h3 className="text-2xl font-display font-bold text-ink mb-2">Archive is Empty</h3>
                            <p className="text-ink-light mb-8 max-w-md mx-auto">
                                No forms have been created yet. Start composing to populate the registry.
                            </p>
                            <Button onClick={handleCreate} disabled={isCreating}>
                                Compose First Form
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
