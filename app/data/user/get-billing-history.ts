import "server-only";
import { requireUser } from "./require-user";
import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

export async function getBillingHistory() {
  noStore();
  const user = await requireUser();

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
    },
    include: {
      course: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return enrollments;
}
