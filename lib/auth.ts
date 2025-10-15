import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {prisma} from "@/lib/db";
import {env} from "@/lib/env";
import {emailOTP} from "better-auth/plugins"
import {resend} from "@/lib/resend";

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

    plugins: [
        emailOTP({
            async sendVerificationOTP({email, otp}) {
                //implement sending the email to the user
                await resend.emails.send({
                    from: 'Only Students <onboarding@resend.dev>',
                    to: [email],
                    subject: 'Only Students - Verify your email',
                    html: `<p>Your OTP is <strong>${otp}</strong></p>`,
                });
            }
        })
    ]
});