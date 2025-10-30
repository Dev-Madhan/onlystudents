"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Menubar } from "@/components/rich-text-editor/Menubar";
import TextAlign from "@tiptap/extension-text-align";

export function RichTextEditor({field}: {field: any}) {
    const [mounted, setMounted] = useState(false);

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
        immediatelyRender: false, // ✅ avoids SSR hydration issues

        onUpdate: ({editor}) => {
            field.onChange(JSON.stringify(editor.getJSON()));
        },

        content: field.value ? JSON.parse(field.value): "<p>Hello World 🚀</p>"
    });

    if (!mounted || !editor) return null;

    return (
        <div className="w-full border-2 border-input rounded-lg overflow-hidden dark:bg-input/30">
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
