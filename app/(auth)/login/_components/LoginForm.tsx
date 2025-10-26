"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GithubIcon, Loader, Loader2, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const router = useRouter();
    const [githubPending, startGithubTransition] = useTransition();
    const [emailPending, startEmailTransition] = useTransition();
    const [email, setEmail] = useState("");

    async function signInWithGithub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Signed in with Github, you will be redirected...");
                    },
                    onError: () => {
                        toast.error("Internal Server Error");
                    },
                },
            });
        });
    }

    function signInWithEmail() {
        startEmailTransition(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: "sign-in",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Email sent successfully.");
                        router.push(`/verify-request?email=${email}`);
                    },
                    onError: () => {
                        toast.error("Error in sending email");
                    },
                },
            });
        });
    }

    return (
        <div className="px-4">
            <Card className="w-full max-w-sm mx-auto shadow-md border-2 border-border rounded-2xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-xl font-serif font-semibold ">
                        Welcome Back!
                    </CardTitle>
                    <CardDescription className="font-mono text-muted-foreground">
                        Login with your Github or Email account
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-5">
                    <Button
                        disabled={githubPending}
                        onClick={signInWithGithub}
                        className="w-full font-mono"
                        variant="outline"
                    >
                        {githubPending ? (
                            <>
                                <Loader className="size-4 animate-spin" />
                                <span className="ml-2">Loading...</span>
                            </>
                        ) : (
                            <>
                                <GithubIcon className="size-4" />
                                <span className="ml-2">Sign in with Github</span>
                            </>
                        )}
                    </Button>

                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-card px-3 text-muted-foreground font-serif">
              Or continue with
            </span>
                    </div>

                    <div className="grid gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="font-mono text-sm">
                                Email
                            </Label>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="example@gmail.com"
                                required
                                className="font-mono text-sm"
                            />
                        </div>

                        <Button
                            onClick={signInWithEmail}
                            disabled={emailPending}
                            className="font-mono"
                        >
                            {emailPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span className="ml-2">Loading...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="size-4" />
                                    <span className="ml-2">Continue with Email</span>
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
