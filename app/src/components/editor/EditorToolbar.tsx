"use client";

import { Editor } from "@tiptap/react";
import Button from "@/components/ui/Button";
import { SkeletonToolbar } from "@/components/ui/Skeleton";

interface EditorToolbarProps {
    editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
    // Show skeleton toolbar during editor initialization
    if (!editor) return <SkeletonToolbar />;

    return (
        <div className="sticky top-0 z-50 flex items-center p-3 bg-white border-b border-border-strong mb-8 shadow-sm transition-all gap-3">
            <div className="flex items-center gap-1 bg-paper-subtle p-1 rounded-md border border-border">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`h-10 w-10 rounded-md ${editor.isActive("bold") ? "bg-white shadow text-ink-black font-bold border border-border" : "text-ink-black hover:bg-white/50"}`}
                    title="Bold (Cmd+B)"
                >
                    <span className="font-bold font-display text-lg">B</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`h-10 w-10 rounded-md ${editor.isActive("italic") ? "bg-white shadow text-ink-black italic border border-border" : "text-ink-black hover:bg-white/50"}`}
                    title="Italic (Cmd+I)"
                >
                    <span className="italic font-display text-lg">I</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`h-10 w-10 rounded-md ${editor.isActive("strike") ? "bg-white shadow text-ink-black border border-border" : "text-ink-black hover:bg-white/50"}`}
                    title="Strikethrough"
                >
                    <span className="line-through text-base font-serif">S</span>
                </Button>
            </div>

            <div className="w-px h-8 bg-border-strong mx-2"></div>

            <div className="flex items-center gap-1 bg-paper-subtle p-1 rounded-md border border-border">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`h-10 px-4 rounded-md font-display text-base ${editor.isActive("heading", { level: 2 }) ? "bg-white shadow text-ink-black font-bold border border-border" : "text-ink-black hover:bg-white/50"}`}
                    title="Heading 2"
                >
                    H2
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`h-10 px-4 rounded-md font-display text-base ${editor.isActive("heading", { level: 3 }) ? "bg-white shadow text-ink-black font-semibold border border-border" : "text-ink-black hover:bg-white/50"}`}
                    title="Heading 3"
                >
                    H3
                </Button>
            </div>

            <div className="w-px h-8 bg-border-strong mx-2"></div>

            <div className="flex items-center gap-1 bg-paper-subtle p-1 rounded-md border border-border">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`h-10 w-10 rounded-md ${editor.isActive("bulletList") ? "bg-white shadow text-ink-black border border-border" : "text-ink-black hover:bg-white/50"}`}
                    title="Bullet List"
                >
                    <span className="text-2xl leading-none">•</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`h-10 w-10 rounded-md ${editor.isActive("orderedList") ? "bg-white shadow text-ink-black border border-border" : "text-ink-black hover:bg-white/50"}`}
                    title="Ordered List"
                >
                    <span className="text-base font-mono font-medium">1.</span>
                </Button>
            </div>

            <div className="ml-auto flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="h-10 w-10 text-ink-black hover:text-ink-black hover:bg-paper-warm rounded-md"
                    title="Undo"
                >
                    <span className="text-lg">↺</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="text-ink hover:text-ink-black hover:bg-paper-warm rounded-sm"
                    title="Redo"
                >
                    <span className="text-lg">↻</span>
                </Button>
            </div>
        </div>
    );
}
