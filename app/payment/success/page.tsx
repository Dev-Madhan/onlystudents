"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckIcon } from "lucide-react";
import Link from "next/link";
import { useConfetti } from "@/hooks/use-confetti";
import { useEffect } from "react";

export default function PaymentSuccessful() {
    const { triggerConfetti } = useConfetti();

    useEffect(() => {
        triggerConfetti();
    }, [triggerConfetti]);
    return (
        <div className="w-full min-h-screen flex flex-1 justify-center items-center">
            <Card className="w-[350px] p-6">
                <div className="w-full flex justify-center">
                    <CheckIcon className="size-12 p-2 bg-green-500/20 text-green-500 rounded-full" />
                </div>

                <div className="mt-5 w-full flex flex-col items-center justify-center">
                    <h1 className="text-xl font-semibold">Payment Successful</h1>
                    <p className="text-sm font-serif text-muted-foreground mt-2 text-center">
                        Congrats your payment was successful. You should now have access to the course!
                    </p>
                </div>

                <div className="mt-5 w-full">
                    <Button asChild className="w-full">
                        <Link href="/dashboard">
                            Go to dashboard
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            </Card>
        </div>
    )
}
