"use client";

/* =========================================================
   IMPORTS
   ========================================================= */
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
  DragEndEvent,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ReactNode, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import {
  reorderChapters,
  reorderLessons,
} from "@/app/admin/courses/[courseId]/edit/action";

/* =========================================================
   TYPES
   ========================================================= */
interface iAppProps {
  data: AdminCourseSingularType;
}

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

/* =========================================================
   SORTABLE ITEM WRAPPER
   ========================================================= */
function SortableItem({
  id,
  children,
  className,
  data,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      className={cn("touch-none", isDragging && "z-10", className)}
    >
      {children(listeners)}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
export function CourseStructure({ data }: iAppProps) {
  /* -------------------------------------------------------
     INITIAL STATE
     ------------------------------------------------------- */
  const initialItems =
    data.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];

  const [items, setItems] = useState(initialItems);

  /* -------------------------------------------------------
     SYNC WHEN DATA CHANGES
     ------------------------------------------------------- */
  useEffect(() => {
    setItems((prev) =>
      data.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: prev.find((c) => c.id === chapter.id)?.isOpen ?? true,
        lessons: chapter.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          order: lesson.position,
        })),
      }))
    );
  }, [data]);

  /* -------------------------------------------------------
     DND SENSORS
     ------------------------------------------------------- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /* =======================================================
     DRAG END HANDLER
     ======================================================= */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;
    const courseId = data.id;

    /* ---------------- CHAPTER REORDER ---------------- */
    if (activeType === "chapter" && overType === "chapter") {
      const oldIndex = items.findIndex((c) => c.id === active.id);
      const newIndex = items.findIndex((c) => c.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(items, oldIndex, newIndex);
      const updated = reordered.map((c, i) => ({ ...c, order: i + 1 }));
      const previous = [...items];

      setItems(updated);

      toast.promise(reorderChapters(courseId, updated.map(c => ({
        id: c.id,
        position: c.order,
      }))), {
        loading: "Reordering Chapters...",
        success: (res) => {
          if (res.status === "success") return res.message;
          throw new Error(res.message);
        },
        error: () => {
          setItems(previous);
          return "Failed to reorder chapters.";
        },
      });

      return;
    }

    /* ---------------- LESSON REORDER ---------------- */
    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId;
      if (!chapterId) return;

      const chapterIndex = items.findIndex((c) => c.id === chapterId);
      if (chapterIndex === -1) return;

      const chapter = items[chapterIndex];
      const oldIndex = chapter.lessons.findIndex(l => l.id === active.id);
      const newIndex = chapter.lessons.findIndex(l => l.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedLessons = arrayMove(chapter.lessons, oldIndex, newIndex);
      const updatedLessons = reorderedLessons.map((l, i) => ({
        ...l,
        order: i + 1,
      }));

      const previous = [...items];
      const newItems = [...items];
      newItems[chapterIndex] = { ...chapter, lessons: updatedLessons };
      setItems(newItems);

      toast.promise(
        reorderLessons(
          chapterId,
          updatedLessons.map(l => ({ id: l.id, position: l.order })),
          courseId
        ),
        {
          loading: "Reordering Lessons...",
          success: (res) => {
            if (res.status === "success") return res.message;
            throw new Error(res.message);
          },
          error: () => {
            setItems(previous);
            return "Failed to reorder lessons.";
          },
        }
      );
    }
  }

  /* -------------------------------------------------------
     TOGGLE CHAPTER
     ------------------------------------------------------- */
  function toggleChapter(id: string) {
    setItems((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isOpen: !c.isOpen } : c
      )
    );
  }

  /* =======================================================
     UI
     ======================================================= */
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <SortableContext items={items.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {items.map((chapter) => (
              <SortableItem key={chapter.id} id={chapter.id} data={{ type: "chapter" }}>
                {(listeners) => (
                  <Card>
                    <Collapsible open={chapter.isOpen} onOpenChange={() => toggleChapter(chapter.id)}>
                      {/* Chapter Header */}
                      <div className="flex items-center justify-between p-3 border-b">
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost" {...listeners}>
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button size="icon" variant="ghost">
                              {chapter.isOpen ? <ChevronDown /> : <ChevronRight />}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="pl-2 font-medium">{chapter.title}</p>
                        </div>
                        <Button size="icon" variant="outline">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      {/* Lessons */}
                      <CollapsibleContent>
                        <div className="p-1 space-y-2">
                          <SortableContext
                            items={chapter.lessons.map(l => l.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {chapter.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: chapter.id }}
                              >
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded">
                                    <div className="flex items-center gap-2">
                                      <Button size="icon" variant="ghost" {...lessonListeners}>
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        href={`/admin/courses/${data.id}/${chapter.id}/${lesson.id}`}
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <Button size="icon" variant="outline">
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>

                          <Button variant="outline" className="w-full">
                            Create New Lesson
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
