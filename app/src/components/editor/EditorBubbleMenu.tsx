"use client";

import { Editor, BubbleMenu } from "@tiptap/react";
import Button from "@/components/ui/Button";

interface EditorBubbleMenuProps {
    editor: Editor;
}

export default function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
    // Bubble menu is contextual - no placeholder needed when editor unavailable
    if (!editor) return <></>;

    return (
        <BubbleMenu
            editor={editor}
            className="flex items-center gap-1 p-1 bg-paper-white rounded-full shadow-champagne-lg border border-champagne/20 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200"
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`w-8 h-8 rounded-full ${editor.isActive('bold') ? 'bg-champagne/20 text-ink-black' : 'text-ink-mid hover:bg-paper-warm'}`}
                title="Bold"
            >
                <span className="font-bold font-display">B</span>
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`w-8 h-8 rounded-full ${editor.isActive('italic') ? 'bg-champagne/20 text-ink-black' : 'text-ink-mid hover:bg-paper-warm'}`}
                title="Italic"
            >
                <span className="italic font-display">I</span>
            </Button>
            <div className="w-px h-4 bg-border-subtle mx-1"></div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`w-8 h-8 rounded-full ${editor.isActive('heading', { level: 2 }) ? 'bg-champagne/20 text-ink-black' : 'text-ink-mid hover:bg-paper-warm'}`}
                title="Heading 2"
            >
                <span className="font-bold text-xs">H2</span>
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`w-8 h-8 rounded-full ${editor.isActive('heading', { level: 3 }) ? 'bg-champagne/20 text-ink-black' : 'text-ink-mid hover:bg-paper-warm'}`}
                title="Heading 3"
            >
                <span className="font-medium text-xs">H3</span>
            </Button>
            <div className="w-px h-4 bg-border-subtle mx-1"></div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`w-8 h-8 rounded-full ${editor.isActive('bulletList') ? 'bg-champagne/20 text-ink-black' : 'text-ink-mid hover:bg-paper-warm'}`}
                title="Bullet List"
            >
                <span className="text-xs">•-</span>
            </Button>
        </BubbleMenu>
    );
}
