"use server";

import { ApiResponse } from "@/lib/types";
import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import arcjet from "@/lib/arcjet";
import { fixedWindow, request } from "@arcjet/next";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover", // ✅ VALID & STABLE
});

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function enrollInCourseAction(
  courseId: string
): Promise<ApiResponse | never> {
  const user = await requireUser();

  try {
    // ─────────────────────────────────────────────
    // Arcjet protection
    // ─────────────────────────────────────────────
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.id,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "You have been blocked due to rate limiting",
      };
    }

    // ─────────────────────────────────────────────
    // 1. Fetch course
    // ─────────────────────────────────────────────
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    // ─────────────────────────────────────────────
    // 2. Get or create Stripe customer
    // ─────────────────────────────────────────────
    let stripeCustomerId: string;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });

    if (dbUser?.stripeCustomerId) {
      stripeCustomerId = dbUser.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // ─────────────────────────────────────────────
    // 3. Transaction: enrollment + checkout
    // ─────────────────────────────────────────────
    const { checkoutUrl } = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId,
          },
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (existingEnrollment?.status === "Active") {
        return { checkoutUrl: null };
      }

      const enrollment = existingEnrollment
        ? await tx.enrollment.update({
            where: { id: existingEnrollment.id },
            data: {
              amount: course.price,
              status: "Pending",
            },
          })
        : await tx.enrollment.create({
            data: {
              userId: user.id,
              courseId,
              amount: course.price,
              status: "Pending",
            },
          });

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "payment",
        line_items: [
          {
            price: "price_1SseUrGRZJzZi32YeYoF3QNi", // TODO: dynamic later
            quantity: 1,
          },
        ],
        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
        metadata: {
          enrollmentId: enrollment.id,
          userId: user.id,
          courseId,
        },
      });

      return { checkoutUrl: session.url! };
    });

    // ─────────────────────────────────────────────
    // 4. Final result
    // ─────────────────────────────────────────────
    if (!checkoutUrl) {
      return {
        status: "success",
        message: "You are already enrolled in this course.",
      };
    }

    // 🚨 MUST NOT BE CAUGHT
    redirect(checkoutUrl);
  } catch (error) {
    // ✅ Allow Next.js redirect to work
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: "Payment system error. Please try again later.",
      };
    }

    console.error("Enroll error:", error);

    return {
      status: "error",
      message: "Failed to enroll in course",
    };
  }
}
