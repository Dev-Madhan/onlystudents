"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse } from "@/lib/types";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zodSchema";
import { prisma } from "@/lib/db";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

/* =========================================================
   ARCJET CONFIG
   ========================================================= */
const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

/* =========================================================
   EDIT COURSE
   ========================================================= */
export async function editCourse(
  data: CourseSchemaType,
  courseId: string
): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return { status: "error", message: "Rate limit exceeded" };
      }
      if (decision.reason.isBot()) {
        return { status: "error", message: "Bot detected" };
      }
      return { status: "error", message: "Access denied" };
    }

    const result = courseSchema.safeParse(data);
    if (!result.success) {
      return { status: "error", message: "Invalid data" };
    }

    await prisma.course.update({
      where: { id: courseId, userId: user.user.id },
      data: result.data,
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { status: "success", message: "Course updated successfully" };
  } catch {
    return { status: "error", message: "Failed to update course" };
  }
}

/* =========================================================
   REORDER LESSONS (✅ FIXED SIGNATURE)
   ========================================================= */
export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[]
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!lessons.length) {
      return { status: "error", message: "No lessons provided" };
    }

    await prisma.$transaction(
      lessons.map((lesson) =>
        prisma.lesson.update({
          where: { id: lesson.id },
          data: {
            position: lesson.position,
            chapterId,
          },
        })
      )
    );

    revalidatePath(`/admin/courses`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch {
    return { status: "error", message: "Failed to reorder lessons" };
  }
}

/* =========================================================
   REORDER CHAPTERS
   ========================================================= */
export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!chapters.length) {
      return { status: "error", message: "No chapters provided" };
    }

    await prisma.$transaction(
      chapters.map((chapter) =>
        prisma.chapter.update({
          where: { id: chapter.id },
          data: { position: chapter.position },
        })
      )
    );

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { status: "success", message: "Chapters reordered successfully" };
  } catch {
    return { status: "error", message: "Failed to reorder chapters" };
  }
}

/* =========================================================
   CREATE CHAPTER
   ========================================================= */
export async function createChapter(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = chapterSchema.safeParse(values);
    if (!result.success) {
      return { status: "error", message: "Invalid data" };
    }

    const maxPos = await prisma.chapter.findFirst({
      where: { courseId: result.data.courseId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    await prisma.chapter.create({
      data: {
        title: result.data.name,
        courseId: result.data.courseId,
        position: (maxPos?.position ?? 0) + 1,
      },
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return { status: "success", message: "Chapter created successfully" };
  } catch {
    return { status: "error", message: "Failed to create chapter" };
  }
}

/* =========================================================
   CREATE LESSON
   ========================================================= */
export async function createLesson(
  values: LessonSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = lessonSchema.safeParse(values);
    if (!result.success) {
      return { status: "error", message: "Invalid data" };
    }

    const maxPos = await prisma.lesson.findFirst({
      where: { chapterId: result.data.chapterId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    await prisma.lesson.create({
      data: {
        title: result.data.name,
        description: result.data.description,
        videoKey: result.data.videoKey,
        thumbnailKey: result.data.thumbnailKey,
        chapterId: result.data.chapterId,
        position: (maxPos?.position ?? 0) + 1,
      },
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return { status: "success", message: "Lesson created successfully" };
  } catch {
    return { status: "error", message: "Failed to create lesson" };
  }
}

/* =========================================================
   DELETE LESSON (SAFE)
   ========================================================= */
export async function deleteLesson({
  chapterId,
  lessonId,
  courseId,
}: {
  chapterId: string;
  lessonId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          include: {
            lessons: { orderBy: { position: "asc" } },
          },
        },
      },
    });

    if (!course) {
      return { status: "error", message: "Course not found" };
    }

    const chapter = course.chapters.find(
      (c) => c.id === chapterId
    );

    if (!chapter) {
      return {
        status: "error",
        message: "Chapter not found in the course",
      };
    }

    const lessonExists = chapter.lessons.some(
      (lesson) => lesson.id === lessonId
    );

    if (!lessonExists) {
      return {
        status: "error",
        message: "Lesson not found in the chapter",
      };
    }

    const remainingLessons = chapter.lessons.filter(
      (lesson) => lesson.id !== lessonId
    );

    await prisma.$transaction([
      ...remainingLessons.map((lesson, index) =>
        prisma.lesson.update({
          where: { id: lesson.id },
          data: { position: index + 1 },
        })
      ),
      prisma.lesson.delete({ where: { id: lessonId } }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson deleted and reordered successfully",
    };
  } catch {
    return { status: "error", message: "Failed to delete lesson" };
  }
}

/* =========================================================
   DELETE CHAPTER (SAFE)
   ========================================================= */
export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          orderBy: { position: "asc" },
          include: { lessons: true },
        },
      },
    });

    if (!course) {
      return { status: "error", message: "Course not found" };
    }

    const chapterExists = course.chapters.some(
      (c) => c.id === chapterId
    );

    if (!chapterExists) {
      return {
        status: "error",
        message: "Chapter not found in the course",
      };
    }

    const remainingChapters = course.chapters.filter(
      (c) => c.id !== chapterId
    );

    await prisma.$transaction([
      prisma.lesson.deleteMany({ where: { chapterId } }),
      prisma.chapter.delete({ where: { id: chapterId } }),
      ...remainingChapters.map((chapter, index) =>
        prisma.chapter.update({
          where: { id: chapter.id },
          data: { position: index + 1 },
        })
      ),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted and reordered successfully",
    };
  } catch {
    return { status: "error", message: "Failed to delete chapter" };
  }
}
