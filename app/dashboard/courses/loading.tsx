import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardCoursesLoading() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="mb-6">
                <Skeleton className="h-9 w-40 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-xl border overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-3">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
