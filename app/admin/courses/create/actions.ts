"use server";

import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

/* =========================================================
   ARCJET CONFIG
   ========================================================= */

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

/* =========================================================
   CREATE COURSE
   ========================================================= */

export async function CreateCourse(
  data: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    /* ---------------- ARCJET PROTECTION ---------------- */

    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests. Please try again later.",
        };
      }

      if (decision.reason.isBot()) {
        return {
          status: "error",
          message:
            "Automated activity detected. If this is a mistake, contact support.",
        };
      }

      return {
        status: "error",
        message: "Access denied.",
      };
    }

    /* ---------------- VALIDATION ---------------- */

    const parsed = courseSchema.safeParse(data);

    if (!parsed.success) {
      return {
        status: "error",
        message: "Invalid course data.",
      };
    }

    const {
      title,
      description,
      fileKey,
      demoVideoKey,
      price,
      duration,
      level,
      category,
      smallDescription,
      slug,
      status,
    } = parsed.data;

    /* ---------------- DATABASE ---------------- */

    await prisma.course.create({
      data: {
        title,
        description,
        fileKey,
        demoVideoKey, // ✅ optional, safe
        price,
        duration,
        level,
        category,
        smallDescription,
        slug,
        status,
        userId: session.user.id,
      },
    });

    return {
      status: "success",
      message: "Course created successfully.",
    };
  } catch (error) {
    console.error("CreateCourse error:", error);

    return {
      status: "error",
      message: "Failed to create course.",
    };
  }
}
