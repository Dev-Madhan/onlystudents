import { Skeleton } from "@/components/ui/skeleton";

export function LessonSkeleton() {
    return (
        <div className="flex flex-col gap-8 w-full p-4 md:p-8 animate-in fade-in duration-500">
            <div className="space-y-6">
                {/* Video Skeleton */}
                <Skeleton className="w-full aspect-video rounded-xl" />
                
                {/* Button Skeleton */}
                <div className="py-4 border-b">
                    <Skeleton className="h-10 w-40 rounded-md" />
                </div>

                {/* Description Skeleton */}
                <div className="pt-4 space-y-4">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <div className="space-y-3 mt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-[95%]" />
                        <Skeleton className="h-4 w-[75%]" />
                        <Skeleton className="h-4 w-[85%]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
