import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { constructUrl } from "@/lib/construct-url";

export async function adminGetRecentCourses() {
  await requireAdmin();

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 2,
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
      userId: true,
    },
  });

  return data.map((course) => ({
    ...course,
    thumbnailUrl: constructUrl(course.fileKey),
  }));
}
