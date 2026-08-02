import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Play, Check } from "lucide-react";

interface iAppProps {
    lesson: {
        id: string;
        title: string;
        position: number;
        description: string | null;
    };
    slug: string;
    isActive?: boolean;
    completed: boolean;
}

export function LessonItem({ lesson, slug, isActive, completed }: iAppProps) {
    return (
        <Link
            href={`/dashboard/${slug}/${lesson.id}`}
            className={buttonVariants({
                variant: completed ? "ghost" : "outline",
                className: cn(
                    "w-full p-2.5 h-auto justify-start transition-all border-2",
                    completed
                        ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20",
                    isActive && !completed ? "bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary" : "",
                    isActive && completed ? "bg-primary/20 border-primary/30" : ""
                ),
            })}
        >
            <div className="flex items-center gap-2.5 w-full min-w-0">
                <div className="shrink-0">
                    {completed ? (
                        <div className="size-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="size-3 text-primary-foreground" strokeWidth={3} />
                        </div>
                    ) : (
                        <div 
                            className={cn(
                                "size-5 rounded-full border-2 bg-background flex justify-center items-center",
                                isActive 
                                    ? "border-primary bg-primary/10 dark:bg-primary/20" 
                                    : "border-muted-foreground/60"
                            )}
                        >
                            <Play 
                                className={cn(
                                    "size-2.5 fill-current",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )} 
                            />
                        </div>
                    )}
                </div>

                <div className="flex-1 text-left min-w-0">
                    <p className={cn(
                        "text-xs truncate",
                        isActive ? "font-semibold text-foreground" : "font-medium"
                    )}>
                        {lesson.position}. {lesson.title}
                    </p>
                    {completed && (
                        <p className="text-[10px] text-primary/80 font-medium">
                            Completed
                        </p>
                    )}
                    {isActive && !completed && (
                        <p className="text-[10px] text-primary font-medium">
                            Currently Watching
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
