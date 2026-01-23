"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import Button from "@/components/ui/Button";

interface RichTextEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    editable?: boolean;
    seamless?: boolean;
    hideToolbar?: boolean; // Hide internal toolbar when parent provides one
    onEditorReady?: (editor: Editor) => void; // Callback to expose editor instance
}

import BubbleMenu from "@tiptap/extension-bubble-menu";
import FloatingMenu from "@tiptap/extension-floating-menu";
import EditorBubbleMenu from "./editor/EditorBubbleMenu";
import EditorFloatingMenu from "./editor/EditorFloatingMenu";
import { Markdown } from "tiptap-markdown";

import { EditorToolbar } from "./editor/EditorToolbar";
import { SkeletonEditor } from "./ui/Skeleton";

export default function RichTextEditor({
    content = "",
    onChange,
    editable = true,
    hideToolbar = false,
    onEditorReady,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-accent border-b border-champagne-light hover:text-accent-hover transition-colors",
                },
            }),
            Placeholder.configure({
                placeholder: "Start writing...",
                emptyEditorClass: "is-editor-empty before:text-ink-muted before:content-[attr(data-placeholder)] before:float-left before:pointer-events-none",
            }),
            BubbleMenu.configure({
                pluginKey: 'bubbleMenu',
            }),
            FloatingMenu.configure({
                pluginKey: 'floatingMenu',
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange?.(editor.storage.markdown.getMarkdown());
        },
        editorProps: {
            attributes: {
                // Removed border logic. Now purely relying on Canvas for containment.
                // Added min-h to ensure clicking anywhere feels like the page.
                class: "document-content max-w-none focus:outline-none min-h-[600px] pb-32",
            },
        },
        immediatelyRender: false,
    });

    // Update content if changed externally
    useEffect(() => {
        if (editor && content !== editor.storage.markdown.getMarkdown()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    // Notify parent when editor is ready
    useEffect(() => {
        if (editor && onEditorReady) {
            onEditorReady(editor);
        }
    }, [editor, onEditorReady]);

    if (!editor) {
        // Show skeleton during editor initialization to prevent layout shift
        return <SkeletonEditor />;
    }

    return (
        <div className="relative w-full">
            {editable && !hideToolbar && <EditorToolbar editor={editor} />}

            <div className="relative">
                {/* Floating menus still available for power users */}
                {editable && (
                    <>
                        <EditorBubbleMenu editor={editor} />
                        <EditorFloatingMenu editor={editor} />
                    </>
                )}

                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
