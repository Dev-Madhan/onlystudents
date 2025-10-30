import { type Editor, useEditorState } from "@tiptap/react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
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
import { Button } from "@/components/ui/button";

interface MenubarProps {
    editor: Editor | null;
}

export function Menubar({ editor }: MenubarProps) {
    if (!editor) return null;

    // ✅ Use `useEditorState` correctly — pass a function that reads from `editor` directly
    const state = useEditorState({
        editor,
        selector: () => ({
            canUndo: editor.can().undo(),
            canRedo: editor.can().redo(),
            isBold: editor.isActive("bold"),
            isItalic: editor.isActive("italic"),
            isStrike: editor.isActive("strike"),
            isHeading1: editor.isActive("heading", { level: 1 }),
            isHeading2: editor.isActive("heading", { level: 2 }),
            isHeading3: editor.isActive("heading", { level: 3 }),
            isBulletList: editor.isActive("bulletList"),
            isOrderedList: editor.isActive("orderedList"),
            align: editor.isActive({ textAlign: "left" })
                ? "left"
                : editor.isActive({ textAlign: "center" })
                    ? "center"
                    : editor.isActive({ textAlign: "right" })
                        ? "right"
                        : "left",
        }),
    });

    return (
        <div className="border-2 border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
            <TooltipProvider>
                {/* === Text Style Buttons === */}
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={state.isBold}
                                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                                className={cn(state.isBold && "bg-muted text-muted-foreground")}
                            >
                                <Bold />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bold</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={state.isItalic}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleItalic().run()
                                }
                                className={cn(
                                    state.isItalic && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Italic />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Italic</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={state.isStrike}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleStrike().run()
                                }
                                className={cn(
                                    state.isStrike && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Strikethrough />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Strike</TooltipContent>
                    </Tooltip>
                </div>

                {/* === Headings === */}
                <div className="flex flex-wrap gap-1 ml-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={state.isHeading1}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                                }
                            >
                                <Heading1Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 1</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={state.isHeading2}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                                }
                            >
                                <Heading2Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 2</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={state.isHeading3}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                                }
                            >
                                <Heading3Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 3</TooltipContent>
                    </Tooltip>
                </div>

                {/* === Lists === */}
                <div className="flex flex-wrap gap-1 ml-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={state.isBulletList}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleBulletList().run()
                                }
                            >
                                <ListIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={state.isOrderedList}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleOrderedList().run()
                                }
                            >
                                <ListOrdered />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Ordered List</TooltipContent>
                    </Tooltip>
                </div>

                {/* === Alignment === */}
                <div className="flex flex-wrap gap-1 ml-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={state.align === "left"}
                                onPressedChange={() =>
                                    editor.chain().focus().setTextAlign("left").run()
                                }
                            >
                                <AlignLeft />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Left</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={state.align === "center"}
                                onPressedChange={() =>
                                    editor.chain().focus().setTextAlign("center").run()
                                }
                            >
                                <AlignCenter />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Center</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={state.align === "right"}
                                onPressedChange={() =>
                                    editor.chain().focus().setTextAlign("right").run()
                                }
                            >
                                <AlignRight />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Right</TooltipContent>
                    </Tooltip>
                </div>

                {/* === Undo/Redo === */}
                <div className="flex flex-wrap gap-1 ml-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                type="button"
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!state.canUndo}
                            >
                                <Undo />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                type="button"
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!state.canRedo}
                            >
                                <Redo />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    );
}
