import "server-only";
import { requireUser } from "./require-user";
import { prisma } from "@/lib/db";
import { constructUrl } from "@/lib/construct-url";
import { unstable_noStore as noStore } from "next/cache";

export async function getEnrolledCourses() {
  noStore();
  const user = await requireUser();

  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          smallDescription: true,
          fileKey: true,
          level: true,
          slug: true,
          duration: true,
          chapters: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return data.map((enrollment) => ({
    ...enrollment,
    course: {
      ...enrollment.course,
      thumbnailUrl: constructUrl(enrollment.course.fileKey as string),
    },
  }));
}
