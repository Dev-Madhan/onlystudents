import "server-only";
import { requireUser } from "./require-user";
import { prisma } from "@/lib/db";
import { constructUrl } from "@/lib/construct-url";

export async function getEnrolledCoursesByUserId(userId: string) {
  const data = await prisma.enrollment.findMany({
    where: {
      userId: userId,
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
                  lessonProgress: {
                    where: {
                      userId: userId,
                    },
                    select: {
                      completed: true,
                      lessonId: true,
                    },
                  },
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

export async function getEnrolledCourses() {
  const user = await requireUser();
  return getEnrolledCoursesByUserId(user.id);
}

export type EnrolledCourseType = Awaited<
  ReturnType<typeof getEnrolledCoursesByUserId>
>[0];
