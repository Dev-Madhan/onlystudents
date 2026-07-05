import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelled() {
    return (
        <div className="w-full min-h-screen flex flex-1 justify-center items-center">
            <Card className="w-[350px] p-6">
                <div className="w-full flex justify-center">
                    <XIcon className="size-12 p-2 bg-red-500/20 text-red-500 rounded-full" />
                </div>

                <div className="mt-5 w-full flex flex-col items-center justify-center">
                    <h1 className="text-xl font-semibold">Payment Cancelled</h1>
                    <p className="text-sm font-serif text-muted-foreground mt-2 text-center">
                        No worries, you won't be charged. Please try again!
                    </p>
                </div>

                <div className="mt-5 w-full">
                    <Button asChild className="w-full">
                        <Link href="/">
                            <ArrowLeft className="size-4" />
                            Back to Home</Link>
                    </Button>
                </div>
            </Card>
        </div>
    )
}