export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesChart } from "./_components/sales-chart";
import { IndianRupee, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedMetric } from "./_components/animated-metric";

export default async function SalesPage() {
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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sales & Analytics</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedMetric 
                value={totalRevenue} 
                prefix="₹" 
                format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} 
              />
            </div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Count</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedMetric value={totalSales} prefix="+" />
            </div>
            <p className="text-xs text-muted-foreground">Total enrollments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Your revenue tracking over the past months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart data={chartData} />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              The 5 most recent purchases on your platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {enrollments.slice(0, 5).map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1 pr-4 truncate">
                    <p className="text-sm font-medium leading-none truncate">{enrollment.user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {enrollment.course.title}
                    </p>
                  </div>
                  <div className="ml-auto font-medium tabular-nums shrink-0 whitespace-nowrap text-green-500">
                    +₹{enrollment.amount.toFixed(2)}
                  </div>
                </div>
              ))}
              {enrollments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No transactions yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>A detailed history of all course enrollments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-2 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[250px]">Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No enrollments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground tracking-tight">{enrollment.user.name}</span>
                          <span className="text-xs text-muted-foreground mt-0.5">{enrollment.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-sm text-muted-foreground">{enrollment.course.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground font-medium">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(enrollment.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={enrollment.status === "Active" 
                            ? "bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 text-xs uppercase tracking-wider" 
                            : "bg-muted text-muted-foreground border-muted-foreground/20 px-3 py-1 text-xs uppercase tracking-wider"}
                        >
                          {enrollment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums text-primary">
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
