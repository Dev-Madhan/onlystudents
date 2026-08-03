import "server-only";
import { prisma } from "@/lib/db";
import { cache } from "react";

export const getComments = cache(async (lessonId: string) => {
    const comments = await prisma.comment.findMany({
        where: {
            lessonId: lessonId,
            parentId: null, // Only fetch top-level comments directly
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true,
                },
            },
            replies: {
                orderBy: {
                    createdAt: "asc", // Oldest replies first makes sense for a thread
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            role: true,
                        },
                    },
                },
            },
        },
    });

    return comments;
});

export type LessonComment = Awaited<ReturnType<typeof getComments>>[0];
export type LessonCommentReply = LessonComment["replies"][0];
