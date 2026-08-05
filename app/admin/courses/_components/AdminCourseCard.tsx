"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import Link from "next/link";
import { ArrowRight, Eye, MoreVertical, Pencil, School, TimerIcon, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ShieldX } from "lucide-react";

interface iAppProps {
    data: AdminCourseType;
    currentUserId: string;
}

export function AdminCourseCard({ data, currentUserId }: iAppProps) {
    const router = useRouter();
    const [accessDeniedOpen, setAccessDeniedOpen] = useState(false);

    const isOwner = data.userId === currentUserId;

    function handleEditClick(e: React.MouseEvent) {
        if (!isOwner) {
            e.preventDefault();
            setAccessDeniedOpen(true);
        }
    }

    function handleEditNavigate() {
        if (isOwner) {
            router.push(`/admin/courses/${data.id}/edit`);
        } else {
            setAccessDeniedOpen(true);
        }
    }

    return (
        <>
            <Card className="group relative py-0 gap-0">
                {/*{ absolute dropdown }*/}
                <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon">
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={handleEditNavigate}
                                className="cursor-pointer"
                            >
                                <Pencil className="size-4 mr-2" />
                                Edit Course
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href={`/courses/${data.slug}`}>
                                    <Eye className="size-4 mr-2" />
                                    Preview
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link href={`/admin/courses/${data.id}/delete`}>
                                    <Trash2 className="size-4 mr-2 text-destructive" />
                                    Delete Course
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Image src={data.thumbnailUrl} alt={data.title} width={600} height={400}
                    unoptimized
                    className="w-full rounded-t-lg aspect-video h-full object-cover" />

                <CardContent className="p-4">
                    <Link
                        href={`/admin/courses/${data.id}/edit`}
                        onClick={handleEditClick}
                        className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors duration-200 font-serif"
                    >
                        {data.title}
                    </Link>

                    <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
                        {data.smallDescription}
                    </p>

                    <div className="mt-4 flex items-center gap-x-5">
                        <div className="flex items-center gap-x-2">
                            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                            <p className="text-sm text-muted-foreground font-mono font-medium">{data.duration}h</p>
                        </div>

                        <div className="flex items-center gap-x-2">
                            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                            <p className="text-sm text-muted-foreground font-mono font-medium">{data.level}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleEditNavigate}
                        className={buttonVariants({
                            className: "w-full font-mono font-medium mt-4 cursor-pointer",
                        })}
                    >
                        Edit Course <ArrowRight className="size-4" />
                    </button>
                </CardContent>
            </Card>

            {/* Access Denied Dialog */}
            <AlertDialog open={accessDeniedOpen} onOpenChange={setAccessDeniedOpen}>
                <AlertDialogContent className="
                    w-[calc(100%-2rem)] mx-auto rounded-2xl
                    sm:max-w-md sm:rounded-xl
                    p-5 sm:p-6
                ">
                    <AlertDialogHeader className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 flex items-center justify-center size-10 sm:size-11 rounded-full bg-destructive/10">
                                <ShieldX className="size-5 sm:size-6 text-destructive" />
                            </div>
                            <AlertDialogTitle className="text-lg sm:text-xl leading-tight">
                                Access Denied
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed font-serif">
                            You can only edit courses that you have created. This course belongs to another
                            administrator, so editing is not permitted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4 sm:mt-5">
                        <AlertDialogAction
                            onClick={() => setAccessDeniedOpen(false)}
                            className="w-full h-11 sm:h-10 sm:w-auto text-sm sm:text-base"
                        >
                            Close
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    );
}

export function AdminCourseCardSkeleton() {
    return (
        <>
            <Card className="group relative py-0 gap-0">
                <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="size-8 rounded-md" />
                </div>

                <div className="w-full relative h-fit">
                    <Skeleton className="w-full aspect-video rounded-t-lg h-[250px] object-cover" />
                </div>

                <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2 rounded" />
                    <Skeleton className="h-4 w-full rounded mb-4" />
                    <div className="mt-4 flex items-center gap-x-5">
                        <div className="flex items-center gap-x-2">
                            <Skeleton className="size-6 rounded-md" />
                            <Skeleton className="h-4 w-10 rounded" />
                        </div>

                        <div className="flex items-center gap-x-2">
                            <Skeleton className="size-6 rounded-md" />
                            <Skeleton className="h-4 w-10 rounded" />
                        </div>
                    </div>

                    <Skeleton className="w-full h-10 rounded font-mono font-medium mt-4" />
                </CardContent>
            </Card>
        </>
    )
}
