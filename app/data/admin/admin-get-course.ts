import "server-only";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

/* =========================================================
   GET SINGLE COURSE (ADMIN)
   ========================================================= */

export async function adminGetCourse(courseId: string) {
  await requireAdmin();

  const data = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      userId: true,
      title: true,
      description: true,
      smallDescription: true,
      slug: true,

      fileKey: true,
      demoVideoKey: true, // ✅ FIXED: demo video support

      price: true,
      duration: true,
      level: true,
      category: true,
      status: true,

      chapters: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              videoKey: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    notFound();
  }

  return data;
}

/* =========================================================
   TYPES
   ========================================================= */

export type AdminCourseSingularType =
  Awaited<ReturnType<typeof adminGetCourse>>;
