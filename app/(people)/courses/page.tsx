import type { Metadata } from "next";
import {getAllCourse} from "@/app/data/course/get-all-course";
import {PublicCourseCard, PublicCourseCardSkeleton} from "@/app/(people)/_components/PublicCourseCard";
import {Suspense} from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getEnrolledCoursesByUserId, EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { CourseProgressCard } from "@/app/dashboard/_components/CourseProgressCard";
import { EmptyState } from "@/components/general/EmptyState";

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
      <div className="mt-5 mb-10">
          <Suspense fallback={<LoadingSkeletonLayout />}>
              <RenderCourses />
          </Suspense>
      </div>
  );
}

async function RenderCourses(){
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const courses = await getAllCourse();
    let enrolledCourses: EnrolledCourseType[] = [];

    if (session?.user) {
        enrolledCourses = await getEnrolledCoursesByUserId(session.user.id);
    }

    const unEnrolledCourses = courses.filter(
        (course) => !enrolledCourses.some((enrolled) => enrolled.course.id === course.id)
    );

    return (
        <div className="flex flex-col gap-12">
            {enrolledCourses.length > 0 && (
                <div className="flex flex-col space-y-6">
                    <div className="flex flex-col space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Your Enrolled Courses</h2>
                        <p className="text-muted-foreground font-serif">Continue your learning journey right from here.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((enrollment) => (
                            <CourseProgressCard 
                                key={enrollment.course.id} 
                                data={enrollment} 
                                linkPrefix="/dashboard" 
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col space-y-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Explore Courses</h1>
                    <p className="text-muted-foreground font-serif">Explore a wide range of courses created to help you learn, grow, and reach your goals.</p>
                </div>
                {unEnrolledCourses.length === 0 ? (
                    <EmptyState
                        title="No courses available"
                        description="You have already purchased all available courses."
                        buttonText="Go to Dashboard"
                        href="/dashboard"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {unEnrolledCourses.map((course) => (
                            <PublicCourseCard key={course.id} data={course as any} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function LoadingSkeletonLayout(){
    return (
        <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Explore Courses</h1>
                <p className="text-muted-foreground font-serif">Explore a wide range of courses created to help you learn, grow, and reach your goals.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({length: 9}).map((_, index) => (
                    <PublicCourseCardSkeleton key={index}/>
                ))}
            </div>
        </div>
    )
}