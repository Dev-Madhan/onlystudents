"use client";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import { CheckCircle, BookIcon } from "lucide-react";
import Image from "next/image";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface iAppProps {
    data: LessonContentType;
}

export function CourseContent({ data }: iAppProps) {
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
                    videoKey={data.videoKey}
                    thumbnailKey={data.thumbnailKey}
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">{data.title}</h1>
                        <p className="text-muted-foreground font-serif">Lesson {data.position}</p>
                    </div>

                    <Button size="lg" variant="outline" className="shrink-0 flex items-center gap-2">
                        <CheckCircle className="size-5 text-primary" />
                        Mark as Completed
                    </Button>
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
            </div>
        </div>
    );
}
