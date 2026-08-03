import type { Metadata } from "next";
import { getAllCourse } from "../data/course/get-all-course";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { EmptyState } from "@/components/general/EmptyState";
import { PublicCourseCard } from "@/app/(people)/_components/PublicCourseCard";
import { CourseProgressCard } from "./_components/CourseProgressCard";

export const metadata: Metadata = {
  title: "My Dashboard",
  description:
    "View your enrolled courses, track your learning progress, and discover new courses on Only Students.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourse(),
    getEnrolledCourses(),
  ]);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-bricolage">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have access to
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No courses purchased"
          description="You haven't purchased any courses yet."
          buttonText="Browse Courses"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((enrollment) => (
            <CourseProgressCard 
              key={enrollment.course.id} 
              data={enrollment} 
              linkPrefix="/dashboard" 
            />
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="text-3xl font-bold font-bricolage">Available Courses</h2>
          <p className="text-muted-foreground">
            Here you can see all the courses you can purchase
          </p>
        </div>

        {courses.filter(
          (course: any) =>
            !enrolledCourses.some(
              ({ course: enrolled }: any) => enrolled.id === course.id
            )
        ).length === 0 ? (
          <EmptyState
            title="No courses available"
            description="You have already purchased all available courses."
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.filter(
              (course: any) =>
                !enrolledCourses.some(
                  ({ course: enrolled }: any) => enrolled.id === course.id
                )
            ).map((course: any) => (
              <PublicCourseCard key={course.id} data={course as any} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}