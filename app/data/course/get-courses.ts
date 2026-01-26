import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getInduvidualCourses(slug: string) {
  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      title: true,
      description: true,

      fileKey: true,

      // ✅ FIX: include demo video key
      demoVideoKey: true,

      price: true,
      duration: true,
      level: true,
      category: true,
      smallDescription: true,

      chapters: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
          lessons: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return course;
}
