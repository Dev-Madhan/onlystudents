// proxy.ts
import arcjet, { detectBot } from "@arcjet/next";
import { isSpoofedBot } from "@arcjet/inspect";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { createAuthMiddleware } from "better-auth/api";

const aj = arcjet({
  key: env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR",
        "CATEGORY:PREVIEW",
        "STRIPE_WEBHOOK",
      ],
    }),
  ],
});

// ----------------------
// Arcjet + Auth Check
// ----------------------
async function protect(request: NextRequest) {
  // Use request.headers ONLY
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decision = await aj.protect(request);

  if (decision.isDenied() || decision.results.some(isSpoofedBot)) {
    return NextResponse.json(
      { error: "Forbidden", reason: decision.reason },
      { status: 403 }
    );
  }

  return null; // allow
}

// ----------------------
// Better Auth Middleware
// ----------------------
const authMiddleware = createAuthMiddleware(async (ctx) => {
  if (!ctx.request) return NextResponse.next();

  const session = await auth.api.getSession({
    headers: ctx.request.headers,
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", ctx.request.url));
  }

  return NextResponse.next();
});

// ----------------------
// Final Middleware
// ----------------------
export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // First: Better Auth
    const authRes = await authMiddleware({ request });
    if (authRes && authRes.headers.get("location")) {
      return authRes; // redirect means blocked
    }

    // Second: Arcjet + Auth
    const block = await protect(request);
    if (block) return block;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
