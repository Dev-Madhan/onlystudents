

import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {prisma} from "@/lib/db";
import {env} from "@/lib/env";
import {emailOTP} from "better-auth/plugins"
import {resend, EMAIL_SENDER} from "@/lib/resend";
import {admin} from "better-auth/plugins"

export const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.BETTER_AUTH_URL],
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    databaseHooks: {
        session: {
            create: {
                after: async (session: any) => {
                    try {
                        const u = await prisma.user.findUnique({ where: { id: session.userId } });
                        if (u && u.notifyAccountActivity && u.email) {
                            // Intentionally not awaiting so it runs in background without slowing down login
                            resend.emails.send({
                                from: EMAIL_SENDER,
                                to: [u.email],
                                subject: "New sign-in to your account",
                                html: `
                                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                        <h2>Security Alert</h2>
                                        <p>Hi ${u.name},</p>
                                        <p>We noticed a new sign-in to your Only Students account.</p>
                                        <p>If this was you, you don't need to do anything. If you don't recognize this activity, please contact support immediately.</p>
                                        <br/>
                                        <p>Stay safe,<br/>Only Students Security</p>
                                    </div>
                                `,
                            }).catch(console.error);
                        }
                    } catch (e) {
                        console.error("Failed to send login alert", e);
                    }
                }
            }
        },
        user: {
            update: {
                after: async (user: any) => {
                    try {
                        // User object from hook might not have custom fields typed, so we fetch cleanly
                        const u = await prisma.user.findUnique({ where: { id: user.id } });
                        if (u && u.notifyAccountActivity && u.email) {
                            resend.emails.send({
                                from: EMAIL_SENDER,
                                to: [u.email],
                                subject: "Your account was updated",
                                html: `
                                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                        <h2>Account Update</h2>
                                        <p>Hi ${u.name},</p>
                                        <p>We're letting you know that some information on your Only Students account was recently updated.</p>
                                        <p>If you made these changes, no further action is needed. If you did not make these changes, please contact support immediately.</p>
                                        <br/>
                                        <p>Stay safe,<br/>Only Students Security</p>
                                    </div>
                                `,
                            }).catch(console.error);
                        }
                    } catch (e) {
                        console.error("Failed to send account update alert", e);
                    }
                }
            }
        }
    },
    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_SECRET,
        },
        google: {
            clientId: env.AUTH_GOOGLE_CLIENT_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET,
            mapProfileToUser: async (profile: any) => {
                console.log("GOOGLE PROFILE DATA:", profile);
                
                return {
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            }
        },
    },

    plugins: [
        emailOTP({
            async sendVerificationOTP({email, otp}) {
                //implement sending the email to the user
                await resend.emails.send({
                    from: EMAIL_SENDER,
                    to: [email],
                    subject: 'Only Students - Verify your email',
                    html: `<p>Your OTP is <strong>${otp}</strong></p>`,
                });
            },
        }),
        admin(),
    ],
});