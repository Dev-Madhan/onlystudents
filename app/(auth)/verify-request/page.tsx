"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {useState, useTransition, Suspense} from "react";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {useRouter, useSearchParams} from "next/navigation";
import { toast } from "sonner";
import {Loader2} from "lucide-react";

// Separate the content that uses useSearchParams into its own component
function VerifyContent() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [emailPending, startTransition] = useTransition();
    const params = useSearchParams();
    const email = params.get('email') as string;
    const isOtpCompleted = otp.length === 6;

    function verifyOtp(){
        startTransition(async () => {
            await authClient.signIn.emailOtp({
                email: email,
                otp: otp,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Email verified Successfully!");
                        router.push("/");
                    },
                    onError: () => {
                        toast.error("Error verifying Email/OTP");
                    }
                }
            })
        })
    }

    return (
        <Card className="w-full mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-xl font-sans text-blue-200">
                    Please check your email {email ? `(${email})` : ''}
                </CardTitle>
                <CardDescription className="font-sans">
                    We have sent a verification email code to your email address.
                    Please open the email and paste the code below.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-2">
                    <InputOTP value={otp} onChange={(value) => setOtp(value)} maxLength={6} className="gap-2">
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <p className="text-sm text-muted-foreground font-sans">
                        Enter the 6-digit code sent to your email
                    </p>
                </div>

                <Button
                    onClick={verifyOtp}
                    disabled={emailPending || !isOtpCompleted || !email}
                    className="w-full font-sans"
                >
                    {emailPending ? (
                        <>
                            <Loader2 className='size-4 animate-spin mr-2' />
                            <span className="font-sans">Loading...</span>
                        </>
                    ) : (
                        "Verify Account"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}

// Loading fallback component
function LoadingFallback() {
    return (
        <Card className="w-full mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-xl font-sans text-blue-200">Loading...</CardTitle>
                <CardDescription className="font-sans">Preparing verification form...</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-center">
                    <Loader2 className="size-8 animate-spin text-blue-200" />
                </div>
            </CardContent>
        </Card>
    );
}

// Main page component that wraps everything in Suspense
export default function VerifyRequest() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <VerifyContent />
        </Suspense>
    );
}