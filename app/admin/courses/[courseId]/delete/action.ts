"use server";

/**
 * Admin-only course deletion action
 * Protected using:
 * 1. Admin authentication
 * 2. Arcjet bot detection
 * 3. Arcjet rate limiting
 */

import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import arcjet, {fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

/**
 * Configure Arcjet with:
 * - Bot detection
 * - Fixed window rate limiting (5 requests per minute)
 */
const aj = arcjet.withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5, // Max 5 requests per minute per user
    })
  );

/**
 * Delete a course by ID
 * @param courseId - ID of the course to delete
 */
export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  // 1. Ensure the user is an admin
  const session = await requireAdmin();

  try {
    // 2. Get current request for Arcjet protection
    const req = await request();

    // 3. Apply Arcjet protection using user ID as fingerprint
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    // 4. Handle Arcjet denials
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
          message: "You are a bot! If this is a mistake, contact support.",
        };
      }

      return {
        status: "error",
        message: "Access Denied",
      };
    }

    // 5. Extra safety check
    if (!session || !session.user) {
      return {
        status: "error",
        message: "Unauthorized",
      };
    }

    // 6. Delete course from a database
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    // 7. Revalidate admin courses page
    revalidatePath("/admin/courses");

    // 8. Success response
    return {
      status: "success",
      message: "Course Deleted Successfully",
    };
  } catch (error) {
    console.error("Delete course error:", error);

    // 9. Error response
    return {
      status: "error",
      message: "Failed to delete course",
    };
  }
}
