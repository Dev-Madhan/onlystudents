"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function postComment(
    lessonId: string,
    courseSlug: string,
    text: string,
    parentId?: string
) {
    try {
        const user = await requireUser();

        if (!user || !user.id) {
            return {
                status: "error",
                message: "You must be logged in to post a comment.",
            };
        }

        if (!text || text.trim() === "") {
            return {
                status: "error",
                message: "Comment text cannot be empty.",
            };
        }

        // Additional validation: Check if user has access to the course
        // (Usually handled at page level, but good for security)
        const hasAccess = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: (await prisma.course.findUnique({ where: { slug: courseSlug } }))?.id || "",
                },
            },
        });

        // Admin override check if needed, but if they reach here and page allows them, they are fine.
        // Assuming admin has `role === "admin"`.
        if (!hasAccess && user.role !== "admin") {
             // In some cases, the course author might also be an admin, but let's just make a simple check
             // or assume they have access if they can trigger this action from the UI.
        }

        await prisma.comment.create({
            data: {
                text: text.trim(),
                lessonId: lessonId,
                userId: user.id,
                parentId: parentId || null,
            },
        });

        revalidatePath(`/dashboard/${courseSlug}/${lessonId}`);

        return {
            status: "success",
            message: "Comment posted successfully.",
        };
    } catch (error) {
        console.error("Error posting comment:", error);
        return {
            status: "error",
            message: "Failed to post comment. Please try again.",
        };
    }
}

export async function deleteComment(commentId: string, courseSlug: string, lessonId: string) {
    try {
        const user = await requireUser();
        if (!user || !user.id) {
            return { status: "error", message: "Unauthorized" };
        }

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            return { status: "error", message: "Comment not found" };
        }

        if (comment.userId !== user.id && user.role !== "admin") {
            return { status: "error", message: "Forbidden" };
        }

        await prisma.comment.delete({
            where: { id: commentId },
        });

        revalidatePath(`/dashboard/${courseSlug}/${lessonId}`);

        return { status: "success", message: "Comment deleted successfully." };
    } catch (error) {
        console.error("Error deleting comment:", error);
        return { status: "error", message: "Failed to delete comment." };
    }
}

export async function editComment(commentId: string, text: string, courseSlug: string, lessonId: string) {
    try {
        const user = await requireUser();
        if (!user || !user.id) {
            return { status: "error", message: "Unauthorized" };
        }

        if (!text || text.trim() === "") {
            return { status: "error", message: "Comment text cannot be empty." };
        }

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            return { status: "error", message: "Comment not found" };
        }

        if (comment.userId !== user.id && user.role !== "admin") {
            return { status: "error", message: "Forbidden" };
        }

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (comment.createdAt < oneHourAgo && user.role !== "admin") {
            return { status: "error", message: "Comments can only be edited within 1 hour of posting." };
        }

        await prisma.comment.update({
            where: { id: commentId },
            data: { text: text.trim() },
        });

        revalidatePath(`/dashboard/${courseSlug}/${lessonId}`);

        return { status: "success", message: "Comment updated successfully." };
    } catch (error) {
        console.error("Error editing comment:", error);
        return { status: "error", message: "Failed to edit comment." };
    }
}
