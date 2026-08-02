import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {EnrolledCourseType} from "@/app/data/user/get-enrolled-courses";
import Image from "next/image";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useCourseProgress } from "@/hooks/use-course-progress";

interface iAppProps {
    data: EnrolledCourseType;
    linkPrefix?: string;
}

export function CourseProgressCard({data, linkPrefix = "/courses"}: iAppProps) {
    const { totalLessons, completedLessons, progressPercentage } = useCourseProgress(data.course.chapters);

    return (
        <Card className="group relative py-0 gap-0">
            <Badge className="absolute top-2 right-2 z-10 bg-course-level text-course-level-foreground hover:bg-course-level/80 border-none backdrop-blur-md">{data.course.level}</Badge>
            <Image src={data.course.thumbnailUrl} alt={data.course.title} width={600} height={600} unoptimized className="w-full rounded-t-xl aspect-video h-full object-cover" />

            <CardContent className="p-4">
                <Link href={`${linkPrefix}/${data.course.slug}`} className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors duration-200 font-serif">
                    {data.course.title}
                </Link>
                <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">{data.course.smallDescription}</p>

                <div className="mt-4 space-y-4">
                    <div className="flex justify-between mb-1 text-sm">
                        <p>Progress:</p>
                        <p className="font-medium">{progressPercentage}%</p>
                    </div>
                    <Progress value={progressPercentage} className="h-1.5" />
                    
                    <p className="text-xs text-muted-foreground">
                        {completedLessons} of {totalLessons} lessons completed
                    </p>
                </div>

                <Link href={`${linkPrefix}/${data.course.slug}`} className={buttonVariants({
                    className: "w-full mt-4 font-mono"
                })}>
                    Continue Learning
                </Link>
            </CardContent>
        </Card>
    )
}

export function CourseProgressCardSkeleton() {
    return (
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-2 right-2 z-10 flex items-center">
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <div className="w-full relative h-fit">
                <Skeleton className="w-full rounded-t-xl aspect-video" />
            </div>

            <CardContent className="p-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-1.5 w-full rounded-full" />
                </div>

                <Skeleton className="mt-4 w-full h-10 rounded-md" />
            </CardContent>
        </Card>
    )
}