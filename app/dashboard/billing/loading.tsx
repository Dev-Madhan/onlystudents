import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function BillingLoading() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="mb-6">
                <Skeleton className="h-9 w-44 mb-2" />
                <Skeleton className="h-4 w-72" />
            </div>
            <Card>
                <CardHeader className="pb-4">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-56 mt-1" />
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border overflow-hidden">
                        <div className="bg-muted/50 flex gap-4 px-4 py-3">
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-4 py-4 border-t">
                                <Skeleton className="h-4 flex-1" />
                                <Skeleton className="h-4 w-[150px]" />
                                <Skeleton className="h-6 w-[80px] rounded-full" />
                                <Skeleton className="h-4 w-[100px]" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
