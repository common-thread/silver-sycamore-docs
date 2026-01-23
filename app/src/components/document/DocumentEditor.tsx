import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Button from "../ui/Button";
import RichTextEditor from "../RichTextEditor";
import { DocumentCanvas } from "./DocumentCanvas";
import { Editor } from "@tiptap/react";

interface DocumentEditorProps {
    documentId: Id<"documents">;
    initialTitle?: string;
    initialContent: string;
    onSave: () => void;
    onCancel: () => void;
    onEditorReady?: (editor: Editor) => void; // Expose editor instance to parent
}

export function DocumentEditor({
    documentId,
    initialTitle = "Untitled Document",
    initialContent,
    onSave,
    onCancel,
    onEditorReady,
}: DocumentEditorProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [isSaving, setIsSaving] = useState(false);
    const updateDocument = useMutation(api.documents.updateContent);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateDocument({
                id: documentId,
                title: title,
                content: content,
            });
            onSave();
        } catch (error) {
            console.error("Failed to save document:", error);
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DocumentCanvas>
            <div className="flex flex-col animate-in fade-in duration-300 min-h-[60vh]">

                {/* Title input - Clean & Functional */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Document title"
                    className="document-content w-full bg-transparent border-none border-b border-border/50 outline-none pb-2 mb-6 font-display font-bold text-4xl text-ink placeholder:text-ink-muted/30 focus:border-border transition-colors"
                    style={{
                        lineHeight: 1.2,
                        padding: "0.5rem 0",
                        marginBottom: "2rem"
                    }}
                />

                <RichTextEditor
                    content={content}
                    onChange={setContent}
                    editable={!isSaving}
                    seamless={true}
                    hideToolbar={true}
                    onEditorReady={onEditorReady}
                />

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-subtle mt-auto">
                    <span className="text-xs text-ink-muted font-medium mr-auto">
                        Markdown Supported
                    </span>
                    <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </DocumentCanvas>
    );
}
