"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Menubar } from "@/components/rich-text-editor/Menubar";

interface RichTextEditorProps {
  field: {
    value?: string;
    onChange: (value: string) => void;
  };
}

export function RichTextEditor({ field }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    editorProps: {
      attributes: {
        // TAILWIND v4 EXPLANATION:
        // 'prose': Enables the typography styles.
        // 'prose-sm': Sets a professional size scale.
        // 'max-w-none': Prevents text constraint.
        // 'dark:prose-invert': Auto-adjusts colors for dark mode.
        // 'focus:outline-none': Removes default browser focus ring.
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none dark:prose-invert",
      },
    },

    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },

    content: field.value ? JSON.parse(field.value) : "<p>Hello World</p>",
  });

  if (!mounted || !editor) return null;

  return (
    <div className="w-full border-2 border-input rounded-lg overflow-hidden bg-card dark:bg-input/30">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}