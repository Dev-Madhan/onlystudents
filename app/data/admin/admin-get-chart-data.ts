import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetChartData() {
  await requireAdmin();

  // Get enrollments from the last 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: ninetyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Group by date (YYYY-MM-DD)
  const groupedData: Record<string, number> = {};
  for (const enrollment of enrollments) {
    const date = enrollment.createdAt.toISOString().split('T')[0];
    groupedData[date] = (groupedData[date] || 0) + 1;
  }

  // Create an array with continuous dates for the last 90 days
  const chartData = [];
  const currentDate = new Date(ninetyDaysAgo);
  const end = new Date();
  
  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0];
    chartData.push({
      date: dateStr,
      enrollments: groupedData[dateStr] || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return chartData;
}
