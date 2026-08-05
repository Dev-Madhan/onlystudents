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
import { resend, EMAIL_SENDER } from "@/lib/resend";
import arcjet, {fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

/* =========================================================
   ARCJET CONFIG
   ========================================================= */
const aj = arcjet.withRule(
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
  const user = await requireAdmin();

  try {
    if (!lessons.length) {
      return { status: "error", message: "No lessons provided" };
    }

    // Ownership guard — verify the chapter belongs to a course owned by this admin
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: { course: { select: { userId: true } } },
    });

    if (!chapter || chapter.course.userId !== user.user.id) {
      return { status: "error", message: "Access denied: you do not own this course" };
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
  const user = await requireAdmin();

  try {
    if (!chapters.length) {
      return { status: "error", message: "No chapters provided" };
    }

    // Ownership guard
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { userId: true },
    });

    if (!course || course.userId !== user.user.id) {
      return { status: "error", message: "Access denied: you do not own this course" };
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
  const user = await requireAdmin();

  try {
    const result = chapterSchema.safeParse(values);
    if (!result.success) {
      return { status: "error", message: "Invalid data" };
    }

    // Ownership guard
    const course = await prisma.course.findUnique({
      where: { id: result.data.courseId },
      select: { userId: true },
    });

    if (!course || course.userId !== user.user.id) {
      return { status: "error", message: "Access denied: you do not own this course" };
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
  const user = await requireAdmin();

  try {
    const result = lessonSchema.safeParse(values);
    if (!result.success) {
      return { status: "error", message: "Invalid data" };
    }

    // Ownership guard — verify via the chapter's parent course
    const chapter = await prisma.chapter.findUnique({
      where: { id: result.data.chapterId },
      select: { course: { select: { userId: true } } },
    });

    if (!chapter || chapter.course.userId !== user.user.id) {
      return { status: "error", message: "Access denied: you do not own this course" };
    }

    const maxPos = await prisma.lesson.findFirst({
      where: { chapterId: result.data.chapterId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const newLesson = await prisma.lesson.create({
      data: {
        title: result.data.name,
        description: result.data.description,
        videoKey: result.data.videoKey,
        thumbnailKey: result.data.thumbnailKey,
        chapterId: result.data.chapterId,
        position: (maxPos?.position ?? 0) + 1,
      },
    });

    // Send realtime email notifications to enrolled users who opted in
    const courseWithEnrollments = await prisma.course.findUnique({
      where: { id: result.data.courseId },
      include: {
        enrollment: {
          where: { status: "Active" },
          include: {
            user: {
              select: { email: true, notifyCourseUpdates: true, name: true },
            },
          },
        },
      },
    });

    if (courseWithEnrollments) {
      const usersToNotify = courseWithEnrollments.enrollment
        .map((e) => e.user)
        .filter((u) => u.notifyCourseUpdates && u.email);

      if (usersToNotify.length > 0) {
        // We use Promise.allSettled to send emails without crashing if one fails,
        // and we don't strictly await it if we want it to be fully async, but in Server Actions
        // awaiting is safer to ensure it completes before the function returns.
        await Promise.allSettled(
          usersToNotify.map((u) =>
            resend.emails.send({
              from: EMAIL_SENDER,
              to: [u.email],
              subject: `New Lesson Added: ${newLesson.title}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2>Hi ${u.name},</h2>
                  <p>A new lesson "<strong>${newLesson.title}</strong>" has just been added to the course <strong>${courseWithEnrollments.title}</strong>!</p>
                  <p>Check it out now and continue learning.</p>
                  <br/>
                  <p>Best regards,<br/>Only Students Team</p>
                </div>
              `,
            })
          )
        );
      }
    }

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
  const user = await requireAdmin();

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

    // Ownership guard
    if (course.userId !== user.user.id) {
      return { status: "error", message: "Access denied: you do not own this course" };
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
  const user = await requireAdmin();

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

    // Ownership guard
    if (course.userId !== user.user.id) {
      return { status: "error", message: "Access denied: you do not own this course" };
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
