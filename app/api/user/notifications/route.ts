import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                notifyCourseUpdates: true,
                notifyAccountActivity: true,
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Notifications API GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { notifyCourseUpdates, notifyAccountActivity } = body; // Destructure preferences

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                notifyCourseUpdates: notifyCourseUpdates !== undefined ? notifyCourseUpdates : undefined,
                notifyAccountActivity: notifyAccountActivity !== undefined ? notifyAccountActivity : undefined,
            },
            select: {
                notifyCourseUpdates: true,
                notifyAccountActivity: true,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Notifications API POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
