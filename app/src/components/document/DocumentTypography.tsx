"use client";

import { ReactNode } from "react";

interface DocumentTypographyProps {
    children: ReactNode;
    className?: string;
}

/**
 * A wrapper to apply the specific typography rules for the "Word Processor" feel.
 * Targeted specifically for document content (headings, body, lists).
 */
export function DocumentTypography({ children, className = "" }: DocumentTypographyProps) {
    return (
        <div className={`document-content max-w-none ${className}`}>
            {children}
        </div>
    );
}

export function DocumentTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <h1 className={`font-display text-3xl font-bold text-ink mb-2 leading-tight text-left ${className}`}>
            {children}
        </h1>
    );
}
