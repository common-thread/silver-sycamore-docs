"use client";

import { ReactNode } from "react";

// ============================================================================
// HeroHeader
// Standard page title block with optional lead text.
// ============================================================================

interface HeroHeaderProps {
    title: string;
    subtitle?: string;
    align?: "left" | "center";
    className?: string;
    children?: ReactNode; // For actions/badges
}

export function HeroHeader({ title, subtitle, align = "center", className = "", children }: HeroHeaderProps) {
    return (
        <div className={`w-full py-16 md:py-24 bg-paper-warm/30 mb-12 ${className}`}>
            <div className={`max-w-4xl mx-auto px-6 flex flex-col gap-4 ${align === "center" ? "text-center items-center" : "text-left items-start"}`}>
                {children && <div className="mb-2">{children}</div>}
                <h1 className="font-display font-bold text-4xl md:text-5xl text-ink leading-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="font-body text-xl text-ink-light max-w-2xl leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// TwoColumnGrid
// Editorial split layout for content pairs.
// ============================================================================

interface TwoColumnGridProps {
    left: ReactNode;
    right: ReactNode;
    ratio?: "50/50" | "30/70" | "70/30";
    className?: string;
}

export function TwoColumnGrid({ left, right, ratio = "50/50", className = "" }: TwoColumnGridProps) {
    const gridTemplate = {
        "50/50": "md:grid-cols-2",
        "30/70": "md:grid-cols-[1fr_2fr]",
        "70/30": "md:grid-cols-[2fr_1fr]",
    }[ratio];

    return (
        <div className={`grid grid-cols-1 ${gridTemplate} gap-12 md:gap-16 my-12 ${className}`}>
            <div className="flex flex-col gap-6">{left}</div>
            <div className="flex flex-col gap-6">{right}</div>
        </div>
    );
}

// ============================================================================
// FeatureList
// Icon + Text grid for amenities or lists.
// ============================================================================

interface FeatureItem {
    icon?: ReactNode;
    title: string;
    description: string;
}

interface FeatureListProps {
    items: FeatureItem[];
    columns?: 2 | 3;
    className?: string;
}

export function FeatureList({ items, columns = 3, className = "" }: FeatureListProps) {
    const gridCols = columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2";

    return (
        <div className={`grid grid-cols-1 ${gridCols} gap-8 my-12 ${className}`}>
            {items.map((item, index) => (
                <div key={index} className="flex flex-col gap-3 p-6 bg-paper-warm/20 rounded-lg border border-border-subtle hover:border-champagne/30 transition-colors">
                    {item.icon && <div className="text-champagne-deep mb-2">{item.icon}</div>}
                    <h3 className="font-display font-bold text-lg text-ink">{item.title}</h3>
                    <p className="text-ink-light leading-relaxed">{item.description}</p>
                </div>
            ))}
        </div>
    );
}
