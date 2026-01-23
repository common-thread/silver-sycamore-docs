"use client";

import { ReactNode } from "react";

interface DocumentCanvasProps {
    children: ReactNode;
    className?: string;
}

export function DocumentCanvas({ children, className = "" }: DocumentCanvasProps) {
    return (
        <div className="w-full flex justify-center min-h-screen bg-paper-warm/50 pb-20">
            <article
                className={`
          w-full max-w-[850px] 
          mx-auto
          mt-8 md:mt-12
          bg-white
          shadow-md
          min-h-[1100px]
          p-12 md:p-16
          transition-opacity duration-300 ease-in-out
          ${className}
        `}
            >
                {children}
            </article>
        </div>
    );
}
