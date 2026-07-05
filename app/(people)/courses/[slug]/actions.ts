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

  let checkoutUrlToRedirect: string | null = null;

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
        stripePriceId: true,
        stripeProductId: true,
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
      try {
        const customer = await stripe.customers.retrieve(dbUser.stripeCustomerId);
        if (customer.deleted) {
          throw new Error("Customer deleted");
        }
        stripeCustomerId = dbUser.stripeCustomerId;
      } catch (err) {
        // Customer not found or deleted in Stripe, create a new one
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

      let currentStripePriceId = course.stripePriceId;
      if (!currentStripePriceId) {
        // Automatically populate the Stripe IDs for the course if they are missing
        const updatedCourse = await tx.course.update({
          where: { id: courseId },
          data: {
            stripeProductId: "prod_UpPvKshMwSb9Pp",
            stripePriceId: "price_1Tpl5F0OBCTXaBrjlieHmxO5"
          }
        });
        currentStripePriceId = updatedCourse.stripePriceId;
      }

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "payment",
        line_items: [
          {
            price: currentStripePriceId!,
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

    checkoutUrlToRedirect = checkoutUrl;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      console.error("Stripe Error Details:", error);
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

  return {
    status: "success",
    checkoutUrl: checkoutUrlToRedirect as string,
  };
}

