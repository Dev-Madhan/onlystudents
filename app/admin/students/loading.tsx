import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminStudentsLoading() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Skeleton className="h-9 w-36" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-64 mt-1" />
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border-2 overflow-hidden">
                        {/* Table header */}
                        <div className="bg-muted/50 flex gap-4 px-4 py-3">
                            <Skeleton className="h-4 w-[300px]" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        {/* Table rows */}
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-4 py-4 border-t">
                                <div className="flex items-center gap-3 w-[300px]">
                                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-3 w-40" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-8 ml-auto" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
