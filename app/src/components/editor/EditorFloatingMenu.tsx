"use client";

import { Editor } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react/menus";
import Button from "@/components/ui/Button";

interface EditorFloatingMenuProps {
    editor: Editor;
}

export default function EditorFloatingMenu({ editor }: EditorFloatingMenuProps) {
    // Floating menu is contextual - no placeholder needed when editor unavailable
    if (!editor) return <></>;

    return (
        <FloatingMenu
            editor={editor}
            className="flex items-center gap-1 p-1 -ml-10"
        >
            <div className="flex items-center gap-1 p-1 bg-paper-white rounded-md shadow-sm border border-border-subtle hover:shadow-md transition-shadow">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className="w-8 h-8 rounded-sm hover:bg-paper-warm text-ink-light"
                    title="Heading 2"
                >
                    <span className="font-bold text-xs">H2</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className="w-8 h-8 rounded-sm hover:bg-paper-warm text-ink-light"
                    title="List"
                >
                    <span className="text-xs">•</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="w-8 h-8 rounded-sm hover:bg-paper-warm text-ink-light"
                    title="Divider"
                >
                    <span className="text-xs">—</span>
                </Button>
            </div>
        </FloatingMenu>
    );
}
