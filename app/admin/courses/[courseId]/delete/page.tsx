"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {CourseSchemaType} from "@/lib/zodSchema";
import {tryCatch} from "@/hooks/try-catch";
import {CreateCourse} from "@/app/admin/courses/create/actions";
import {toast} from "sonner";
import {useTransition} from "react";
import {deleteCourse} from "@/app/admin/courses/[courseId]/delete/action";
import {useParams, useRouter} from "next/navigation";
import {Loader2, Trash2} from "lucide-react";


export default function DeleteCourseRoute() {
    const [pending, startTransition] = useTransition();
    const {courseId} = useParams<{courseId: string}>();
    const router = useRouter();

    function onSubmit() {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(deleteCourse(courseId));

            if (error) {
                toast.error("An unexpected error occurred. Please try again later.");
                return;
            }

            if (result.status === "success") {
                toast.success(result.message);
                router.push("/admin/courses");
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        })
    }

    return (
        <div className="max-w-xl mx-auto w-full">
            <Card className="mt-32">
                <CardHeader>
                    <CardTitle>Are you sure you want to delete this course?</CardTitle>
                    <CardDescription className="font-serif">This action cannot be undone!</CardDescription>

                    <CardContent className="flex items-center justify-between mt-4">
                        <Link className={buttonVariants({variant: "outline"})} href="/admin/courses">
                            Cancel
                        </Link>
                        <Button variant="destructive" onClick={onSubmit} disabled={pending}>
                            {pending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Deleting...
                                </>
                            ): (
                                <>
                                <Trash2 className="size-4" />
                                    Delete
                                </>
                            )}
                        </Button>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    );
}