"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { VersionBadge } from "@/components/VersionBadge";
import Button from "@/components/ui/Button";
import { Id } from "../../../convex/_generated/dataModel";

interface UnifiedDocumentToolbarProps {
    // Navigation
    documentTitle: string;

    // Actions
    documentId: Id<"documents">;
    contentType: string;
    version: number;
    isCopying: boolean;
    onCopyClick: () => void;
    onShareClick: () => void;
    onHistoryClick: () => void;

    // Edit Mode
    isEditing: boolean;
    onEditClick: () => void;
    editor: Editor | null; // Tiptap editor instance for formatting controls
}

export function UnifiedDocumentToolbar({
    documentTitle,
    documentId,
    contentType,
    version,
    isCopying,
    onCopyClick,
    onShareClick,
    onHistoryClick,
    isEditing,
    onEditClick,
    editor,
}: UnifiedDocumentToolbarProps) {
    const toolbarRef = useRef<HTMLDivElement>(null);

    // Use CSS custom property to track header height - avoids React state and re-renders
    useEffect(() => {
        const header = document.querySelector(".site-header");
        const toolbar = toolbarRef.current;
        if (!header || !toolbar) return;

        // Helper to update the CSS custom property directly
        const updateToolbarPosition = (height: number) => {
            toolbar.style.setProperty("--toolbar-top", `${height}px`);
        };

        // Set initial position
        updateToolbarPosition(header.clientHeight);

        // Use ResizeObserver for efficient updates on resize
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === header) {
                    updateToolbarPosition(entry.contentRect.height);
                }
            }
        });

        resizeObserver.observe(header);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <>
            {/* Spacer to preserve layout flow since toolbar is fixed */}
            <div className="h-[65px] w-full" aria-hidden="true" />

            <div
                ref={toolbarRef}
                className="fixed left-0 right-0 z-40 bg-white border-b border-stone-200 shadow-sm"
                style={{ top: "var(--toolbar-top, 0px)" }}
            >
                {/* Main Row: Breadcrumb | Formatting (conditional) | Actions */}
                <div className="flex items-center justify-between gap-4 px-6 py-3 max-w-7xl mx-auto">
                    {/* Left: Breadcrumb */}
                    <div className="flex-shrink-0">
                        <Breadcrumb documentTitle={documentTitle} />
                    </div>

                    {/* Center: Formatting Controls (only when editing) */}
                    <div
                        className={`flex-1 flex items-center justify-center gap-2 transition-all duration-300 ${isEditing && editor ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none h-0 overflow-hidden"
                            }`}
                    >
                        {editor && (
                            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-md border border-stone-200">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    disabled={!editor.can().chain().focus().toggleBold().run()}
                                    className={`h-8 w-8 rounded-md text-sm ${editor.isActive("bold")
                                        ? "bg-white shadow-sm text-stone-900 font-bold border border-stone-300"
                                        : "text-stone-700 hover:bg-white/50"
                                        }`}
                                    title="Bold (Cmd+B)"
                                >
                                    <span className="font-bold">B</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                                    className={`h-8 w-8 rounded-md text-sm ${editor.isActive("italic")
                                        ? "bg-white shadow-sm text-stone-900 italic border border-stone-300"
                                        : "text-stone-700 hover:bg-white/50"
                                        }`}
                                    title="Italic (Cmd+I)"
                                >
                                    <span className="italic">I</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleStrike().run()}
                                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                                    className={`h-8 w-8 rounded-md text-sm ${editor.isActive("strike")
                                        ? "bg-white shadow-sm text-stone-900 border border-stone-300"
                                        : "text-stone-700 hover:bg-white/50"
                                        }`}
                                    title="Strikethrough"
                                >
                                    <span className="line-through">S</span>
                                </Button>

                                <div className="w-px h-5 bg-stone-300 mx-1" />

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                    className={`h-8 px-2 rounded-md text-xs font-medium ${editor.isActive("heading", { level: 2 })
                                        ? "bg-white shadow-sm text-stone-900 font-bold border border-stone-300"
                                        : "text-stone-700 hover:bg-white/50"
                                        }`}
                                    title="Heading 2"
                                >
                                    H2
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                    className={`h-8 px-2 rounded-md text-xs font-medium ${editor.isActive("heading", { level: 3 })
                                        ? "bg-white shadow-sm text-stone-900 font-semibold border border-stone-300"
                                        : "text-stone-700 hover:bg-white/50"
                                        }`}
                                    title="Heading 3"
                                >
                                    H3
                                </Button>

                                <div className="w-px h-5 bg-stone-300 mx-1" />

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                    className={`h-8 w-8 rounded-md text-lg ${editor.isActive("bulletList")
                                        ? "bg-white shadow-sm text-stone-900 border border-stone-300"
                                        : "text-stone-700 hover:bg-white/50"
                                        }`}
                                    title="Bullet List"
                                >
                                    •
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                    className={`h-8 w-8 rounded-md text-xs font-mono ${editor.isActive("orderedList")
                                        ? "bg-white shadow-sm text-stone-900 border border-stone-300"
                                        : "text-stone-700 hover:bg-white/50"
                                        }`}
                                    title="Ordered List"
                                >
                                    1.
                                </Button>

                                <div className="w-px h-5 bg-stone-300 mx-1" />

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => editor.chain().focus().undo().run()}
                                    disabled={!editor.can().chain().focus().undo().run()}
                                    className="h-8 w-8 text-stone-600 hover:bg-white/50 rounded-md"
                                    title="Undo"
                                >
                                    <span className="text-base">↺</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => editor.chain().focus().redo().run()}
                                    disabled={!editor.can().chain().focus().redo().run()}
                                    className="h-8 w-8 text-stone-600 hover:bg-white/50 rounded-md"
                                    title="Redo"
                                >
                                    <span className="text-base">↻</span>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={onShareClick}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                                <path
                                    d="M10 5C11.1046 5 12 4.10457 12 3C12 1.89543 11.1046 1 10 1C8.89543 1 8 1.89543 8 3C8 3.17681 8.02234 3.34836 8.06437 3.51165L5.06437 5.51165C4.60621 5.19008 4.04497 5 3.44444 5C1.99238 5 0.814453 6.17793 0.814453 7.63C0.814453 9.08207 1.99238 10.26 3.44444 10.26C4.04497 10.26 4.60621 10.0699 5.06437 9.74835L8.06437 11.7484C8.02234 11.9116 8 12.0832 8 12.26C8 13.3646 8.89543 14.26 10 14.26C11.1046 14.26 12 13.3646 12 12.26C12 11.1554 11.1046 10.26 10 10.26C9.39947 10.26 8.83823 10.4501 8.38007 10.7717L5.38007 8.77165C5.42211 8.60836 5.44445 8.43681 5.44445 8.26C5.44445 8.08319 5.42211 7.91164 5.38007 7.74835L8.38007 5.74835C8.83823 6.06992 9.39947 6.26 10 6.26C11.1046 6.26 12 5.36457 12 4.26C12 4.17681 11.9923 4.09527 11.9776 4.01565"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Share
                        </button>

                        <Link
                            href={`/suggestions/new?documentId=${documentId}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                                <path
                                    d="M10.5 1.5L12.5 3.5L5 11H3V9L10.5 1.5Z"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Suggest
                        </Link>

                        <button
                            onClick={onEditClick}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${isEditing
                                ? "bg-stone-900 text-white hover:bg-stone-800"
                                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                                }`}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                className={isEditing ? "opacity-100" : "opacity-70"}
                            >
                                <path
                                    d="M1.5 10.5V12.5H3.5L9.939 6.06098L7.939 4.06098L1.5 10.5ZM11.485 4.51498C11.691 4.30898 11.691 3.97498 11.485 3.76898L10.231 2.51498C10.025 2.30898 9.691 2.30898 9.485 2.51498L8.646 3.35398L10.646 5.35398L11.485 4.51498Z"
                                    fill="currentColor"
                                />
                            </svg>
                            {isEditing ? "Done" : "Edit"}
                        </button>

                        {isCopying ? (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-400">
                                Running...
                            </span>
                        ) : (
                            <button
                                onClick={onCopyClick}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded transition-colors"
                                title="Copy to Workspace"
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                                    <path
                                        d="M5 3H3C2.44772 3 2 3.44772 2 4V11C2 11.5523 2.44772 12 3 12H10C10.5523 12 11 11.5523 11 11V9"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                    />
                                    <path
                                        d="M7 7L12 2M12 2H9M12 2V5"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Copy
                            </button>
                        )}

                        <div className="h-4 w-px bg-stone-200 mx-1" />

                        <VersionBadge version={version} onClick={onHistoryClick} />
                    </div>
                </div>
            </div>
        </>
    );
}
