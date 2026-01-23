"use client";

import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { VersionBadge } from "@/components/VersionBadge";
import { Id } from "../../../convex/_generated/dataModel";

interface DocumentToolbarProps {
    documentTitle: string;
    documentId: Id<"documents">;
    contentType: string;
    version: number;
    isCopying: boolean;
    onCopyClick: () => void;
    onShareClick: () => void;
    onHistoryClick: () => void;
    onEditClick: () => void;
    isEditing: boolean;
}

export function DocumentToolbar({
    documentTitle,
    documentId,
    contentType,
    version,
    isCopying,
    onCopyClick,
    onShareClick,
    onHistoryClick,
    onEditClick,
    isEditing,
}: DocumentToolbarProps) {
    const showShare = ["procedure", "checklist", "form"].includes(contentType);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-stone-200 pb-4">
            <Breadcrumb documentTitle={documentTitle} />

            <div className="flex items-center gap-2">
                {showShare && (
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
                )}

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
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={isEditing ? "opacity-100" : "opacity-70"}>
                        <path d="M1.5 10.5V12.5H3.5L9.939 6.06098L7.939 4.06098L1.5 10.5ZM11.485 4.51498C11.691 4.30898 11.691 3.97498 11.485 3.76898L10.231 2.51498C10.025 2.30898 9.691 2.30898 9.485 2.51498L8.646 3.35398L10.646 5.35398L11.485 4.51498Z" fill="currentColor" />
                    </svg>
                    {isEditing ? "Editing" : "Edit"}
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

                <VersionBadge
                    version={version}
                    onClick={onHistoryClick}
                />
            </div>
        </div>
    );
}
