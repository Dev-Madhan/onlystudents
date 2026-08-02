import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/general/EmptyState";

interface iAppProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseSlugRoute({ params }: iAppProps) {
  const { slug } = await params;

  const course = await getCourseSidebarData(slug);
  
  // Safely access the first chapter and first lesson
  const firstChapter = course.course.chapters?.[0];
  const firstLesson = firstChapter?.lessons?.[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4">
      <EmptyState
        title="No lessons available"
        description="This course doesn't have any lessons uploaded yet. Please check back later!"
        buttonText="Back to Dashboard"
        href="/dashboard"
      />
    </div>
  );
}
