import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";
import {adminGetCourses} from "@/app/data/admin/admin-get-courses";


export async function adminGetLesson(id: string) {
    await requireAdmin();

    const data = await prisma.lesson.findUnique({
        where:{
            id: id,
        },
        select:{
            title: true,
            description: true,
            videoKey: true,
            thumbnailKey: true,
            position: true,
            id: true,
        },
    });

    if(!data){
        return notFound();
    }
    return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;