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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Billing & Receipts</h2>
          <p className="text-muted-foreground mt-1">View your purchase history and active course subscriptions.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            <CardTitle>Transaction History</CardTitle>
          </div>
          <CardDescription>A detailed list of all your past purchases.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border shadow-sm">
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
                      <TableCell className="font-semibold text-foreground tracking-tight py-4">
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
                      <TableCell className="text-right font-semibold tabular-nums text-primary text-base whitespace-nowrap">
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
