import { ReactNode } from "react";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { CourseSidebar } from "../_components/CourseSidebar";

type Params = Promise<{ slug: string }>;

export default async function CourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}) {
  const { slug } = await params;
  const { course } = await getCourseSidebarData(slug);

  return (
    <div className="flex flex-1 h-[calc(100vh-6rem)]">
      {/* Sidebar - Course Navigation */}
      <div className="w-80 shrink-0 hidden md:block border-r bg-card text-card-foreground h-full overflow-hidden">
        <CourseSidebar course={course} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {children}
      </div>
    </div>
  );
}
