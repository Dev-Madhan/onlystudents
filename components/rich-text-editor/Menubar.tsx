"use client";

import { type Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    Italic,
    ListIcon,
    ListOrdered,
    Redo,
    Strikethrough,
    Undo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenubarProps {
    editor: Editor | null;
}

export function Menubar({ editor }: MenubarProps) {
    // Hook is always called at the top level
    const state = useEditorState({
        editor,
        selector: (ctx) => {
            if (!ctx.editor) {
                return null; // <-- important: return null when editor is not ready
            }

            const e = ctx.editor as Editor;

            return {
                canUndo: e.can().undo(),
                canRedo: e.can().redo(),
                isBold: e.isActive("bold"),
                isItalic: e.isActive("italic"),
                isStrike: e.isActive("strike"),
                isHeading1: e.isActive("heading", { level: 1 }),
                isHeading2: e.isActive("heading", { level: 2 }),
                isHeading3: e.isActive("heading", { level: 3 }),
                isBulletList: e.isActive("bulletList"),
                isOrderedList: e.isActive("orderedList"),
                isAlignLeft: e.isActive({ textAlign: "left" }),
                isAlignCenter: e.isActive({ textAlign: "center" }),
                isAlignRight: e.isActive({ textAlign: "right" }),
            };
        },
    });

    // Guard: if state is null → editor not ready
    if (!state || !editor) return null;

    // Destructure only after the guard → TypeScript knows it's not null
    const {
        canUndo,
        canRedo,
        isBold,
        isItalic,
        isStrike,
        isHeading1,
        isHeading2,
        isHeading3,
        isBulletList,
        isOrderedList,
        isAlignLeft,
        isAlignCenter,
        isAlignRight,
    } = state;

    return (
        <div className="border-2 border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
            <TooltipProvider>
                {/* Formatting */}
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isBold}
                                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                                className={cn(isBold && "bg-muted text-muted-foreground")}
                            >
                                <Bold className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bold</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isItalic}
                                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                                className={cn(isItalic && "bg-muted text-muted-foreground")}
                            >
                                <Italic className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Italic</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isStrike}
                                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                                className={cn(isStrike && "bg-muted text-muted-foreground")}
                            >
                                <Strikethrough className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Strike</TooltipContent>
                    </Tooltip>

                    {/* Headings */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isHeading1}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                                }
                                className={cn(isHeading1 && "bg-muted text-muted-foreground")}
                            >
                                <Heading1Icon className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 1</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isHeading2}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                                }
                                className={cn(isHeading2 && "bg-muted text-muted-foreground")}
                            >
                                <Heading2Icon className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 2</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isHeading3}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                                }
                                className={cn(isHeading3 && "bg-muted text-muted-foreground")}
                            >
                                <Heading3Icon className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 3</TooltipContent>
                    </Tooltip>

                    {/* Lists */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isBulletList}
                                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                                className={cn(isBulletList && "bg-muted text-muted-foreground")}
                            >
                                <ListIcon className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isOrderedList}
                                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                                className={cn(isOrderedList && "bg-muted text-muted-foreground")}
                            >
                                <ListOrdered className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Ordered List</TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Alignment */}
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isAlignLeft}
                                onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                                className={cn(isAlignLeft && "bg-muted text-muted-foreground")}
                            >
                                <AlignLeft className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Left</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isAlignCenter}
                                onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                                className={cn(isAlignCenter && "bg-muted text-muted-foreground")}
                            >
                                <AlignCenter className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Center</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isAlignRight}
                                onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                                className={cn(isAlignRight && "bg-muted text-muted-foreground")}
                            >
                                <AlignRight className="h-4 w-4" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Right</TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Undo / Redo */}
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!canUndo}
                            >
                                <Undo className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!canRedo}
                            >
                                <Redo className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    );
}