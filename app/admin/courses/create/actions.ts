"use server";

import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { stripe } from "@/lib/stripe";
import { constructUrl } from "@/lib/construct-url";

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

    /* ---------------- STRIPE PRODUCT + PRICE ---------------- */

    let stripeData;
    try {
      stripeData = await stripe.products.create({
        name: title,
        description: smallDescription,
        images: [constructUrl(fileKey)],
        default_price_data: {
          currency: "inr",
          unit_amount: price * 100, // convert rupees → paise
        },
        metadata: {
          slug,
          level,
          category,
          duration: String(duration),
        },
      });
    } catch (stripeError: any) {
      console.error("Stripe product creation failed:", stripeError);
      return {
        status: "error",
        message: "Stripe product creation failed: " + (stripeError.message || "Unknown Stripe error"),
      };
    }

    /* ---------------- DATABASE ---------------- */

    try {
      await prisma.course.create({
        data: {
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
          userId: session.user.id,
          stripeProductId: stripeData.id,
          stripePriceId: stripeData.default_price as string,
        },
      });
    } catch (dbError: any) {
      console.error("Database course creation failed:", dbError);
      // Stripe product was created but DB failed — clean up the orphaned Stripe product
      await stripe.products.update(stripeData.id, { active: false }).catch(() => {});
      return {
        status: "error",
        message: "Database error: " + (dbError.message || "Unknown DB error"),
      };
    }

    return {
      status: "success",
      message: "Course created successfully.",
    };
  } catch (error: any) {
    console.error("CreateCourse error:", error);

    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      String(error.digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      status: "error",
      message: "Failed to create course. " + (error.message || ""),
    };
  }
}
