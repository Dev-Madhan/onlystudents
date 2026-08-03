import type { Metadata } from "next";
import { SectionCards } from "@/components/sidebar/section-cards";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminGetDashboardStats } from "@/app/data/admin/admin-get-dashboard-stats";
import { adminGetChartData } from "@/app/data/admin/admin-get-chart-data";
import { adminGetRecentCourses } from "@/app/data/admin/admin-get-recent-courses";
import { EmptyState } from "@/components/general/EmptyState";
import { AdminCourseCard, AdminCourseCardSkeleton } from "@/app/admin/courses/_components/AdminCourseCard";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "Manage your courses, students, and sales on Only Students admin panel.",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function AdminIndexPage() {
    const [stats, chartData] = await Promise.all([
        adminGetDashboardStats(),
        adminGetChartData(),
    ]);

    return (
        <>
            <SectionCards 
                totalSignups={stats.totalSignups}
                totalCustomers={stats.totalCustomers}
                totalCourses={stats.totalCourses}
                totalLessons={stats.totalLessons}
            />
            <div className="px-4 lg:px-6 space-y-4 mt-4">
                <ChartAreaInteractive data={chartData} />
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold font-bricolage">Recent Courses</h2>
                        <Link href="/admin/courses" className={buttonVariants({ variant: "outline" })}>
                            View All Courses
                        </Link>
                    </div>
                    <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
                        <RenderRecentCourses />
                    </Suspense>
                </div>
            </div>
        </>
    )
}

async function RenderRecentCourses() {
    const data = await adminGetRecentCourses();

    if (data.length === 0) {
        return (
            <EmptyState
                buttonText="Create new Course"
                description="you dont have any courses. create some to see them here"
                title="You dont have any courses yet!"
                href="/admin/courses/create"
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((course) => (
                <AdminCourseCard key={course.id} data={course as any} />
            ))}
        </div>
    );
}

function RenderRecentCoursesSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, index) => (
                <AdminCourseCardSkeleton key={index} />
            ))}
        </div>
    );
}