import "server-only";
import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {constructUrl} from "@/lib/construct-url";

export async function adminGetCourses() {
    // await new Promise(resolve => setTimeout(resolve, 2000));
    await requireAdmin();

    const data = await prisma.course.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        select:{
            id: true,
            title: true,
            smallDescription: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            slug: true,
            userId: true,
        },
    });

    return data.map((course) => ({
        ...course,
        thumbnailUrl: constructUrl(course.fileKey),
    }));
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0]
