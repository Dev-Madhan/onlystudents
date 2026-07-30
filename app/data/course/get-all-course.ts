import {prisma} from "@/lib/db";
import {constructUrl} from "@/lib/construct-url";

export async function getAllCourse() {
    const data = await prisma.course.findMany({
        where: {
            status: "Published",
        },
        orderBy:{
          createdAt: "desc",
        },
        select: {
            title: true,
            price: true,
            smallDescription: true,
            slug: true,
            fileKey: true,
            id: true,
            level: true,
            duration: true,
            category: true,
        },
    });

    return data.map((course) => ({
        ...course,
        thumbnailUrl: constructUrl(course.fileKey),
    }));
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourse>>[0]
