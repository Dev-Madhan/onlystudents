"use client";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import { CheckCircle, BookIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useTransition } from "react";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";
import { markLessonComplete } from "../action";
import { tryCatch } from "@/hooks/try-catch";
import { CommentSection } from "./CommentSection";
import { LessonComment } from "@/app/data/course/get-comments";

interface iAppProps {
    data: LessonContentType;
    comments: LessonComment[];
    courseSlug: string;
    currentUserId?: string;
}

export function CourseContent({ data, comments, courseSlug, currentUserId }: iAppProps) {
    const [pending, startTransition] = useTransition();
    const { triggerConfetti } = useConfetti();

    function onSubmit() {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(
                markLessonComplete(data.id, data.chapter.course.slug)
            );

            if (error) {
                toast.error("An unexpected error occurred. Please try again.");
                return;
            }

            if (result?.status === "success") {
                toast.success(result.message);
                triggerConfetti();
            } else if (result) {
                toast.error(result.message);
            }
        });
    }

    function VideoPlayer({
        thumbnailKey,
        videoKey,
    }: {
        thumbnailKey: string | null;
        videoKey: string | null;
    }) {
        const videoUrl = useConstructUrl(videoKey || "");
        const thumbnailUrl = useConstructUrl(thumbnailKey || "");

        if (!videoKey) {
            return (
                <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
                    <BookIcon className="size-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground font-serif">
                        This lesson does not have a video yet
                    </p>
                </div>
            );
        }

        return (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg bg-black border border-muted">
                <video
                    controls
                    poster={thumbnailUrl}
                    className="w-full h-full object-cover"
                >
                    <source src={videoUrl} type="video/mp4" />
                    <source src={videoUrl} type="video/webm" />
                    <source src={videoUrl} type="video/ogg" />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 w-full p-4 md:p-8">
            <div className="space-y-6">
                <VideoPlayer
                    thumbnailKey={data.thumbnailKey ?? ""}
                    videoKey={data.videoKey ?? ""}
                />

                <div className="py-4 border-b">
                    {data.lessonProgress.length > 0 ? (
                        <Button
                            variant="outline"
                            className="bg-green-500/10 text-green-500 hover:text-green-600"
                        >
                            <CheckCircle className="size-4 mr-2 text-green-500" />
                            Completed
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={onSubmit} disabled={pending}>
                            {pending ? (
                                <Loader2 className="size-4 mr-2 animate-spin" />
                            ) : (
                                <CheckCircle className="size-4 mr-2 text-green-500" />
                            )}
                            Mark as Complete
                        </Button>
                    )}
                </div>

                <div className="pt-4">
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Lesson Description</h2>
                    <div className="text-muted-foreground leading-relaxed">
                        {data.description ? (
                            <RenderDescription json={JSON.parse(data.description)} />
                        ) : (
                            <p>No description provided for this lesson.</p>
                        )}
                    </div>
                </div>
                
                <CommentSection 
                    lessonId={data.id} 
                    courseSlug={courseSlug} 
                    comments={comments} 
                    currentUserId={currentUserId} 
                />
            </div>
        </div>
    );
}

