"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {ApiResponse} from "@/lib/types";
import {courseSchema, CourseSchemaType} from "@/lib/zodSchema";
import {prisma} from "@/lib/db";
import arcjet, {detectBot, fixedWindow} from "@/lib/arcjet";
import {request} from "@arcjet/next";

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


export async function editCourse(data: CourseSchemaType, courseId: string): Promise<ApiResponse> {
    const user = await  requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: user.user.id,
        });

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

       const result = courseSchema.safeParse(data);

       if(!result.success){
           return {
               status: "error",
               message: "Invalid Data"
           };
       }

       await prisma.course.update({
           where:{
               id: courseId,
               userId: user.user.id,
           },
           data:{
               ...result.data,
           }
       });

       return {
           status: "success",
           message: "Course Updated Successfully"
       };
    } catch {
        return {
            status: "error",
            message: "Failed to update the course"
        };
    }
}