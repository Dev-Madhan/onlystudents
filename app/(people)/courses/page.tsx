import type { Metadata } from "next";
import {getAllCourse} from "@/app/data/course/get-all-course";
import {PublicCourseCard, PublicCourseCardSkeleton} from "@/app/(people)/_components/PublicCourseCard";
import {Suspense} from "react";

export const metadata: Metadata = {
    title: "Explore Courses",
    description:
        "Browse our curated collection of expert-led online courses in web development, design, programming, and more. Find the perfect course to level up your skills.",
    openGraph: {
        title: "Explore Courses | Only Students",
        description:
            "Browse expert-led online courses and start learning today with Only Students.",
        url: "https://only-student.vercel.app/courses",
    },
    alternates: {
        canonical: "https://only-student.vercel.app/courses",
    },
};


export default function PublicCoursesRoute() {
  return (
      <div className="mt-5">
          <div className="flex flex-col space-y-2 mb-10">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Explore Courses</h1>
              <p className="text-muted-foreground font-serif">Explore a wide range of courses created to help you learn, grow, and reach your goals.</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <PublicCourseCard key={course.id} data={course} />
            ))}
        </div>
    )
}

function LoadingSkeletonLayout(){
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({length: 9}).map((_, index) => (
                <PublicCourseCardSkeleton key={index}/>
            ))}
        </div>
    )
}