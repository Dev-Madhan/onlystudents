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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SalesChart } from "./_components/sales-chart";
import { IndianRupee, CreditCard, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedMetric } from "./_components/animated-metric";
import { Skeleton } from "@/components/ui/skeleton";
import { requireAdmin } from "@/app/data/admin/require-admin";

async function SalesContent() {
  await requireAdmin();
  const enrollments = await prisma.enrollment.findMany({
    include: {
      user: true,
      course: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalRevenue = enrollments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSales = enrollments.length;

  // Group revenue by month for the chart
  const monthlyRevenue: Record<string, number> = {};
  const sortedEnrollments = [...enrollments].reverse();
  sortedEnrollments.forEach((enrollment) => {
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      enrollment.createdAt
    );
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + enrollment.amount;
  });

  const chartData = Object.entries(monthlyRevenue).map(([name, total]) => ({
    name,
    total,
  }));

  return (
    <div className="space-y-4">
      {/* KPI Cards — always 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3 md:px-6 md:pt-6 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium leading-tight font-serif">
              Total Revenue
            </CardTitle>
            <IndianRupee className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
            <div className="text-lg md:text-2xl font-bold leading-none mb-1 font-serif">
              <AnimatedMetric
                value={totalRevenue}
                prefix="₹"
                format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground font-serif">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3 md:px-6 md:pt-6 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium leading-tight font-serif">
              Sales Count
            </CardTitle>
            <CreditCard className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
            <div className="text-lg md:text-2xl font-bold leading-none mb-1 font-serif">
              <AnimatedMetric value={totalSales} prefix="+" />
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground font-serif">
              Total enrollments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Recent Transactions */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Chart — full width on mobile, 60% on desktop */}
        <Card className="w-full lg:flex-[4]">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <CardTitle className="text-base md:text-lg font-serif">Overview</CardTitle>
            </div>
            <CardDescription className="text-xs md:text-sm font-serif">
              Your revenue tracking over the past months.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-4 md:px-4">
            <SalesChart data={chartData} />
          </CardContent>
        </Card>

        {/* Recent Transactions — full width on mobile, 40% on desktop */}
        <Card className="w-full lg:flex-[3]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg font-serif">
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-xs md:text-sm font-serif">
              The 5 most recent purchases.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {enrollments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No transactions yet.
                </p>
              ) : (
                enrollments.slice(0, 5).map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between py-3 gap-3"
                  >
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-medium leading-tight truncate font-serif">
                        {enrollment.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {enrollment.course.title}
                      </p>
                    </div>
                    <div className="font-semibold tabular-nums shrink-0 text-sm text-green-500 whitespace-nowrap">
                      +₹{enrollment.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Transactions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg font-serif">
            All Transactions
          </CardTitle>
          <CardDescription className="text-xs md:text-sm font-serif">
            A detailed history of all course enrollments.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {/* Mobile Card Layout — visible below md */}
          <div className="flex flex-col gap-3 md:hidden">
            {enrollments.length === 0 ? (
              <div className="text-center p-6 border rounded-xl bg-muted/10 text-muted-foreground text-sm">
                No enrollments found.
              </div>
            ) : (
              enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border rounded-xl p-4 bg-card shadow-sm space-y-2.5"
                >
                  {/* Row 1: Name + Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm leading-tight truncate font-serif">
                        {enrollment.user.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5 font-serif">
                        {enrollment.user.email}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        enrollment.status === "Active"
                          ? "bg-green-500/10 text-green-500 border-green-500/20 px-2 py-0.5 text-[10px] uppercase tracking-wider shrink-0"
                          : "bg-muted text-muted-foreground border-muted-foreground/20 px-2 py-0.5 text-[10px] uppercase tracking-wider shrink-0"
                      }
                    >
                      {enrollment.status}
                    </Badge>
                  </div>

                  {/* Row 2: Course title */}
                  <p className="text-xs font-medium text-muted-foreground line-clamp-2">
                    {enrollment.course.title}
                  </p>

                  {/* Row 3: Date + Amount */}
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[11px] text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(enrollment.createdAt)}
                    </span>
                    <span className="font-semibold tabular-nums text-primary text-sm">
                      ₹{enrollment.amount.toFixed(2)}
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
                  <TableHead className="w-[220px]">Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="w-[110px]">Date</TableHead>
                  <TableHead className="w-[90px]">Status</TableHead>
                  <TableHead className="text-right w-[120px]">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No enrollments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  enrollments.map((enrollment) => (
                    <TableRow
                      key={enrollment.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground tracking-tight text-sm font-serif">
                            {enrollment.user.name}
                          </span>
                          <span className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px] font-serif">
                            {enrollment.user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-sm text-muted-foreground max-w-[200px]">
                        <span className="line-clamp-2">
                          {enrollment.course.title}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground font-medium whitespace-nowrap">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(enrollment.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            enrollment.status === "Active"
                              ? "bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 text-xs uppercase tracking-wider"
                              : "bg-muted text-muted-foreground border-muted-foreground/20 px-3 py-1 text-xs uppercase tracking-wider"
                          }
                        >
                          {enrollment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums text-primary whitespace-nowrap">
                        ₹{enrollment.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SalesContentSkeleton() {
  return (
    <div className="space-y-4">
      {/* KPI skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3 md:px-6 md:pt-6 md:pb-2">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-3.5 rounded" />
            </CardHeader>
            <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
              <Skeleton className="h-7 w-24 mb-1.5" />
              <Skeleton className="h-2.5 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Recent skeleton */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <Card className="w-full lg:flex-[4]">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="px-2 md:px-4">
            <Skeleton className="h-[220px] sm:h-[300px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card className="w-full lg:flex-[3]">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-4 w-16 shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SalesPage() {
  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-serif">
          Sales &amp; Analytics
        </h2>
        <p className="text-muted-foreground text-sm mt-1 font-serif">
          Track your revenue, enrollments, and transaction history.
        </p>
      </div>

      <Suspense fallback={<SalesContentSkeleton />}>
        <SalesContent />
      </Suspense>
    </>
  );
}
