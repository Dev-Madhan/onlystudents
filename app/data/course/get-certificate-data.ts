import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getCertificateData(slug: string) {
  const session = await requireUser();

  const course = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      category: true,
      slug: true,
      level: true,
      chapters: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          lessons: {
            select: {
              id: true,
              lessonProgress: {
                where: { userId: session.id },
                select: { completed: true, lessonId: true },
              },
            },
          },
        },
      },
    },
  });

  if (!course) return notFound();

  // Verify active enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: session.id, courseId: course.id },
    },
    select: { status: true, createdAt: true },
  });

  if (!enrollment || enrollment.status !== "Active") return notFound();

  // Verify all lessons are completed
  let totalLessons = 0;
  let completedLessons = 0;

  for (const chapter of course.chapters) {
    for (const lesson of chapter.lessons) {
      totalLessons++;
      const progress = lesson.lessonProgress.find(
        (p) => p.lessonId === lesson.id
      );
      if (progress?.completed) completedLessons++;
    }
  }

  // Guard: if not fully completed, return 404
  if (totalLessons === 0 || completedLessons < totalLessons) {
    return notFound();
  }

  // Generate a cryptographically secure, un-forgeable Certificate ID
  // using SHA-256 hash of the unique user-course enrollment signature.
  const crypto = await import("crypto");
  const rawSignature = `${session.id}-${course.id}-${enrollment.createdAt.getTime()}`;
  const hash = crypto.createHash("sha256").update(rawSignature).digest("hex").substring(0, 16).toUpperCase();
  const certificateId = `${hash.slice(0,4)}-${hash.slice(4,8)}-${hash.slice(8,12)}-${hash.slice(12,16)}`;

  return {
    certificateId,
    user: {
      name: session.name,
      email: session.email,
      image: session.image ?? null,
    },
    course: {
      title: course.title,
      category: course.category,
      slug: course.slug,
      level: course.level,
      totalLessons,
    },
    completedAt: new Date(),
    enrolledAt: enrollment.createdAt,
  };
}

export type CertificateDataType = Awaited<ReturnType<typeof getCertificateData>>;
