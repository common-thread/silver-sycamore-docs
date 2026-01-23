"use client";

import { ReactNode } from "react";

export function DocumentQuote({ children }: { children: ReactNode }) {
    return (
        <blockquote className="my-10 pl-8 border-l-2 border-accent/60 relative">
            <span
                className="absolute -left-3 -top-4 text-4xl text-accent/20 font-display select-none"
                aria-hidden="true"
            >
                &ldquo;
            </span>
            <div className="font-display text-xl text-ink-muted italic leading-relaxed">
                {children}
            </div>
        </blockquote>
    );
}
