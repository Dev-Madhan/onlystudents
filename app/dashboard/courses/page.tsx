import { getAllCourse } from "@/app/data/course/get-all-course";
import { PublicCourseCard, PublicCourseCardSkeleton } from "@/app/(people)/_components/PublicCourseCard";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function DashboardBrowseCatalogPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Browse Catalog</h2>
          <p className="text-muted-foreground mt-1">Explore all available courses and start learning today.</p>
        </div>
      </div>
      
      <Suspense fallback={<LoadingSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

async function RenderCourses(){
    const courses = await getAllCourse();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
                <PublicCourseCard key={course.id} data={course} linkPrefix="/courses" />
            ))}
        </div>
    )
}

function LoadingSkeletonLayout(){
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({length: 8}).map((_, index) => (
                <PublicCourseCardSkeleton key={index}/>
            ))}
        </div>
    )
}
