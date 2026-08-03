import { Suspense } from "react";
import { prisma } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { requireAdmin } from "@/app/data/admin/require-admin";

async function StudentsTable() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { enrollment: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      {/* Mobile Card Layout — visible below md */}
      <div className="flex flex-col gap-3 md:hidden">
        {users.length === 0 ? (
          <div className="text-center p-6 border rounded-xl bg-muted/10 text-muted-foreground text-sm">
            No users found.
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="border rounded-xl p-4 bg-card shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border shadow-sm shrink-0">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-foreground tracking-tight truncate font-bricolage">
                      {user.name}
                    </span>
                    <Badge
                      variant="outline"
                      className={user.role === "admin"
                        ? "bg-primary text-primary-foreground border-primary px-2 py-0.5 text-[10px] capitalize font-medium tracking-wide shadow-sm shrink-0"
                        : "bg-primary/10 text-primary border-primary/30 px-2 py-0.5 text-[10px] capitalize font-medium tracking-wide shrink-0"}
                    >
                      {user.role || "student"}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-0.5 truncate font-bricolage">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Joined {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(user.createdAt)}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Enrollments: <span className="font-semibold text-primary">{user._count.enrollment}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table — visible from md and up */}
      <div className="hidden md:block rounded-xl border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-center">Enrollments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="flex items-center gap-3 py-4">
                    <Avatar className="h-10 w-10 border shadow-sm">
                      <AvatarImage src={user.image || ""} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-foreground tracking-tight font-bricolage">{user.name}</span>
                      <span className="text-xs text-muted-foreground mt-0.5 font-bricolage">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={user.role === "admin"
                        ? "bg-primary text-primary-foreground border-primary px-3 py-1 text-xs capitalize font-medium tracking-wide shadow-sm"
                        : "bg-primary/10 text-primary border-primary/30 px-3 py-1 text-xs capitalize font-medium tracking-wide"}
                    >
                      {user.role || "student"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-medium">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-center font-semibold tabular-nums text-sm">
                    {user._count.enrollment}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function StudentsTableSkeleton() {
  return (
    <>
      {/* Mobile Skeleton */}
      <div className="flex flex-col gap-3 md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="pt-2 border-t border-border/50 flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:block rounded-xl border overflow-hidden">
        <div className="bg-muted/50 flex gap-4 px-4 py-3">
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-t">
            <div className="flex items-center gap-3 w-[300px]">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
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
    </>
  );
}

export default function StudentsPage() {
  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-bricolage">Students</h2>
        <p className="text-muted-foreground text-sm mt-1 font-bricolage">
          Manage your users and view their course enrollments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-bricolage">Registered Users</CardTitle>
          <CardDescription className="font-bricolage">
            All users currently registered on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:p-6 sm:pt-0">
          <Suspense fallback={<StudentsTableSkeleton />}>
            <StudentsTable />
          </Suspense>
        </CardContent>
      </Card>
    </>
  );
}
