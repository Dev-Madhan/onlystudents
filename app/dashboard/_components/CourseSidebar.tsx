"use client";

import { Play, ChevronDown, Award, Lock } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LessonItem } from "./LessonItem";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { useCourseProgress } from "@/hooks/use-course-progress";

interface iAppProps {
  course: CourseSidebarDataType["course"];
  closeButton?: React.ReactNode;
}

export function CourseSidebar({ course, closeButton }: iAppProps) {
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop();

  const { totalLessons, completedLessons, progressPercentage } = useCourseProgress(course.chapters);
  const isCourseCompleted = totalLessons > 0 && completedLessons === totalLessons;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate">
              {course.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {course.category}
            </p>
          </div>
          {closeButton && (
            <div className="shrink-0">
              {closeButton}
            </div>
          )}
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completedLessons}/{totalLessons} lessons</span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground">{progressPercentage}% complete</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {course.chapters.map((chapter: any, index: number) => (
            <Collapsible key={chapter.id} defaultOpen={index === 0}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full p-3 h-auto flex items-center gap-2"
                >
                  <div className="shrink-0">
                    <ChevronDown className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-sm truncate text-foreground">
                      {chapter.position}: {chapter.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium truncate">
                      {chapter.lessons.length} lessons
                    </p>
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
                  {chapter.lessons.map((lesson: any) => (
                    <LessonItem 
                      key={lesson.id} 
                      lesson={lesson} 
                      slug={course.slug} 
                      isActive={currentLessonId === lesson.id}
                      completed={
                        lesson.lessonProgress.find(
                          (progress: any) => progress.lessonId === lesson.id
                        )?.completed || false
                      }
                    />
                  ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Get Certificate Button */}
      <div className="p-4 border-t border-border shrink-0">
        {isCourseCompleted ? (
          <Button id="get-certificate-btn" asChild className="w-full">
            <Link href={`/dashboard/${course.slug}/certificate`}>
              <Award className="size-4" />
              Get Certificate
            </Link>
          </Button>
        ) : (
          <Button
            id="get-certificate-btn-locked"
            variant="outline"
            disabled
            className="w-full"
            title={`Complete all ${totalLessons} lessons to unlock your certificate`}
          >
            <Lock className="size-4" />
            Get Certificate
          </Button>
        )}
        {!isCourseCompleted && (
          <p className="text-[10px] text-muted-foreground text-center mt-2 font-bricolage">
            Complete all lessons to unlock
          </p>
        )}
      </div>
    </div>
  );
}

