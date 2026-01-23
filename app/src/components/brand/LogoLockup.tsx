"use client";

import { LogoIcon } from "@/components/Logo";


type LogoVariant = "horizontal" | "stacked" | "icon-only";
type LogoSize = "sm" | "md" | "lg";

interface LogoLockupProps {
    variant?: LogoVariant;
    size?: LogoSize;
    className?: string;
    showTag?: boolean; // For "Staff Hub" or app-specific tags
    tagText?: string;
}

import Image from "next/image";

export function LogoLockup({
    variant = "horizontal",
    size = "md",
    className = "",
    showTag = false,
    tagText = "Staff Hub",
}: LogoLockupProps) {
    // Size maps for the container
    const sizeClasses = {
        sm: "h-8",
        md: "h-10",
        lg: "h-16",
    } as const;

    // Widths for Next.js Image optimization (aspect ratio approx 4:1 for horizontal)
    const imageDims = {
        sm: { width: 140, height: 32 },
        md: { width: 180, height: 40 },
        lg: { width: 280, height: 64 },
    };

    if (variant === "icon-only") {
        return (
            <div className={`relative aspect-square ${sizeClasses[size]} ${className}`}>
                <Image
                    src="/logo-icon.png"
                    alt="Silver Sycamore"
                    fill
                    className="object-contain"
                />
            </div>
        );
    }

    const dims = imageDims[size];

    if (variant === "stacked") {
        return (
            <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
                <div className={`relative aspect-square ${size === "lg" ? "h-20" : size === "md" ? "h-12" : "h-10"}`}>
                    <Image
                        src="/logo-icon.png"
                        alt="Silver Sycamore Icon"
                        fill
                        className="object-contain"
                    />
                </div>
                <div className={`relative ${size === "lg" ? "h-10 w-48" : size === "md" ? "h-8 w-32" : "h-6 w-24"}`}>
                    <Image
                        src="/logo-text.png"
                        alt="Silver Sycamore Text"
                        fill
                        className="object-contain"
                    />
                </div>
                {showTag && (
                    <div className="flex items-center mt-1 border-t border-stone-300 pt-1">
                        <span className={`font-body font-medium tracking-widest text-accent uppercase ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                            {tagText}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <Image
                src="/logo-horizontal.png"
                alt="Silver Sycamore"
                width={dims.width}
                height={dims.height}
                className="object-contain"
                priority
            />

            {showTag && (
                <div className="flex items-center ml-1">
                    <span className="h-5 w-px bg-stone-300 mx-2 hidden sm:block"></span>
                    <span className={`font-body font-medium tracking-widest text-accent uppercase ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                        {tagText}
                    </span>
                </div>
            )}
        </div>
    );
}
