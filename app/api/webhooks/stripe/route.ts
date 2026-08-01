import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Webhook Error:", errorMessage);
        return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const enrollmentId = session.metadata?.enrollmentId;

        if (!enrollmentId) {
            throw new Error("Enrollment id not found in metadata...");
        }

        await prisma.enrollment.update({
            where: {
                id: enrollmentId,
            },
            data: {
                status: "Active",
            },
        });
    }

    return new Response(null, { status: 200 });
}
