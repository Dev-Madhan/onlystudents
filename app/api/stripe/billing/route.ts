import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { stripeCustomerId: true }
        });

        if (!user?.stripeCustomerId) {
            return NextResponse.json({ error: "No billing history found." }, { status: 400 });
        }

        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: new URL("/dashboard", req.url).toString(),
        });

        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        console.error("Billing Portal Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
