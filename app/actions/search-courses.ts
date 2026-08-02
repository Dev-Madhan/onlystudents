"use server";

import { prisma } from "@/lib/db";
import { constructUrl } from "@/lib/construct-url";

export async function searchCourses(query: string) {
    if (!query || query.trim() === "") {
        return [];
    }

    const data = await prisma.course.findMany({
        where: {
            status: "Published",
            title: {
                contains: query,
                mode: "insensitive",
            },
        },
        take: 10,
        select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            fileKey: true,
        },
    });

    return data.map((course) => ({
        ...course,
        thumbnailUrl: constructUrl(course.fileKey),
    }));
}
