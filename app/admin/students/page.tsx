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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StudentsPage() {
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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Students</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>
            Manage your users and view their course enrollments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-2 overflow-hidden shadow-sm">
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
                          <span className="font-semibold text-foreground tracking-tight">{user.name}</span>
                          <span className="text-xs text-muted-foreground mt-0.5">{user.email}</span>
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
                      <TableCell className="text-center font-semibold tabular-nums">
                        {user._count.enrollment}
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
