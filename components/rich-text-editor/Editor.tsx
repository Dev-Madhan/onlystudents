"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Menubar } from "@/components/rich-text-editor/Menubar";

/**
 * Props for the Rich Text Editor.
 *
 * `field` is the object you get from a form library (e.g. React Hook Form).
 * It must contain:
 *   - `value`: string (JSON-serialized editor content)
 *   - `onChange`: (value: string) => void
 */
interface RichTextEditorProps {
    field: {
        value?: string;
        onChange: (value: string) => void;
    };
}

export function RichTextEditor({ field }: RichTextEditorProps) {
    const [mounted, setMounted] = useState(false);

    // Mark component as mounted on the client – avoids SSR hydration mismatches
    useEffect(() => setMounted(true), []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        editorProps: {
            attributes: {
                class:
                    "min-h-[300px] p-4 focus:outline-none font-serif prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
            },
        },

        // Tiptap renders the editor only on the client
        immediatelyRender: false,

        // Persist changes back to the form field
        onUpdate: ({ editor }) => {
            field.onChange(JSON.stringify(editor.getJSON()));
        },

        // Initial content – fallback to a friendly default
        content: field.value ? JSON.parse(field.value) : "<p>Hello World</p>",
    });

    // While the component is mounting or the editor is still initializing, render nothing.
    if (!mounted || !editor) return null;

    return (
        <div className="w-full border-2 border-input rounded-lg overflow-hidden dark:bg-input/30">
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}