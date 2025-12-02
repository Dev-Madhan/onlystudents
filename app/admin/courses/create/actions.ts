"use server";

import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
    detectBot({
        mode: "LIVE",
        allow: [],
    })
).withRule(
    fixedWindow({
        mode: "LIVE",
        window: "1m",
        max: 5,
    })
);

export async function CreateCourse(data: CourseSchemaType): Promise<ApiResponse> {
    const session = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: session.user.id,
        });

        // FIX 1: specific Arcjet denial handling
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: "error",
                    message: "You have been blocked due to rate limiting",
                };
            }
            if (decision.reason.isBot()) {
                return {
                    status: "error",
                    message: "You are bot! if this is a mistake contact our support",
                };
            }
            // General fallback for denial
            return {
                status: "error",
                message: "Access Denied",
            };
        }

        // FIX 2: Logic Flow. Removed the 'else' block that forced an error on valid users.
        if (!session || !session.user) {
            return {
                status: "error",
                message: "Unauthorized",
            };
        }

        // 3. Validation
        const validation = courseSchema.safeParse(data);

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid Form Data",
            };
        }

        // 4. Database Creation
        await prisma.course.create({
            data: {
                ...validation.data,
                userId: session.user.id,
            },
        });

        return {
            status: "success",
            message: "Course Created Successfully",
        };

    } catch (error) {
        console.error("Course creation error:", error);
        return {
            status: "error",
            message: "Failed to create course",
        };
    }
}