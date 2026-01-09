"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";

export function RenderDescription({ json }: { json: JSONContent }) {
  const output = useMemo(() => {
    if (!json) return "";

    return generateHTML(json, [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ]);
  }, [json]);

  if (!output) return null;

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary font-mono max-w-none">
      {parse(output)}
    </div>
  );
}
