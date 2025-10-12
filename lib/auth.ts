import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {prisma} from "@/lib/db";
import {env} from "@/lib/env";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_SECRET,
        },
    },
});