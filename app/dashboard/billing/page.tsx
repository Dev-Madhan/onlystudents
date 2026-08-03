import { getBillingHistory } from "@/app/data/user/get-billing-history";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedMetric } from "@/app/admin/sales/_components/animated-metric";
import { Receipt } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const enrollments = await getBillingHistory();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-bricolage">Billing & Receipts</h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base font-bricolage">View your purchase history and active course subscriptions.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            <CardTitle className="font-bricolage">Transaction History</CardTitle>
          </div>
          <CardDescription className="font-bricolage">A detailed list of all your past purchases.</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {/* Mobile View */}
          <div className="grid gap-4 md:hidden">
            {enrollments.length === 0 ? (
              <div className="text-center p-6 border rounded-xl bg-muted/10 text-muted-foreground text-sm">
                You haven't made any purchases yet.
              </div>
            ) : (
              enrollments.map((enrollment) => (
                <div key={enrollment.id} className="border rounded-xl p-4 space-y-3 bg-card shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div className="font-semibold line-clamp-2 text-sm font-bricolage">{enrollment.course.title}</div>
                    <Badge 
                      variant="outline"
                      className={enrollment.status === "Active" 
                        ? "bg-green-500/10 text-green-500 border-green-500/20 px-2 py-0.5 text-[10px] uppercase tracking-wider shrink-0" 
                        : "bg-muted text-muted-foreground border-muted-foreground/20 px-2 py-0.5 text-[10px] uppercase tracking-wider shrink-0"}
                    >
                      {enrollment.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(enrollment.createdAt)}
                    </div>
                    <div className="font-semibold tabular-nums text-primary font-bricolage">
                      <AnimatedMetric value={enrollment.amount} prefix="₹" format={{ minimumFractionDigits: 2 }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block rounded-xl border shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead className="w-[150px]">Date Purchased</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="text-right w-[150px]">Amount Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      You haven't made any purchases yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-foreground tracking-tight py-4 font-bricolage">
                        <span className="line-clamp-1">{enrollment.course.title}</span>
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
                          className={enrollment.status === "Active" 
                            ? "bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 text-xs uppercase tracking-wider whitespace-nowrap" 
                            : "bg-muted text-muted-foreground border-muted-foreground/20 px-3 py-1 text-xs uppercase tracking-wider whitespace-nowrap"}
                        >
                          {enrollment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums text-primary text-base whitespace-nowrap font-bricolage">
                        <AnimatedMetric value={enrollment.amount} prefix="₹" format={{ minimumFractionDigits: 2 }} />
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
