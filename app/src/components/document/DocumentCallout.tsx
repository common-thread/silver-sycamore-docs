"use client";

import { ReactNode } from "react";

type CalloutType = "note" | "tip" | "important" | "warning" | "caution";

interface DocumentCalloutProps {
    type?: CalloutType;
    title?: string;
    children: ReactNode;
}

const styles = {
    note: {
        container: "bg-surface-subtle border-l-4 border-ink-light text-ink",
        icon: "ℹ️",
        title: "text-ink-light",
    },
    tip: {
        container: "bg-green-50/50 border-l-4 border-green-500 text-ink",
        icon: "💡",
        title: "text-green-700",
    },
    important: {
        container: "bg-indigo-50/50 border-l-4 border-accent text-ink",
        icon: "💬",
        title: "text-accent",
    },
    warning: {
        container: "bg-amber-50/50 border-l-4 border-amber-500 text-ink",
        icon: "⚠️",
        title: "text-amber-700",
    },
    caution: {
        container: "bg-red-50/50 border-l-4 border-red-500 text-ink",
        icon: "🛑",
        title: "text-red-700",
    },
};

export function DocumentCallout({ type = "note", title, children }: DocumentCalloutProps) {
    const style = styles[type] || styles.note;

    return (
        <div className={`my-8 p-6 rounded-r ${style.container}`}>
            <div className="flex items-center gap-3 mb-2">
                <span className="text-xl" role="img" aria-hidden="true">
                    {style.icon}
                </span>
                <span className={`font-display font-bold uppercase tracking-wide text-xs ${style.title}`}>
                    {title || type}
                </span>
            </div>
            <div className="pl-9 text-ink/90 leading-relaxed font-body">
                {children}
            </div>
        </div>
    );
}
