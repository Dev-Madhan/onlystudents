"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { CourseSidebar } from "./CourseSidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";

export function MobileSidebar({ course }: { course: CourseSidebarDataType["course"] }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close the sheet when the route changes
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
            <span className="font-semibold text-sm truncate mr-4">{course.title}</span>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="shrink-0 gap-2">
                        <Menu className="size-4" />
                        <span className="text-xs font-semibold">Lessons</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80 [&>button]:hidden">
                    <SheetTitle className="sr-only">Course Navigation</SheetTitle>
                    <CourseSidebar 
                        course={course} 
                        closeButton={
                            <SheetClose className="size-8 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
                                <X className="size-5" />
                                <span className="sr-only">Close</span>
                            </SheetClose>
                        }
                    />
                </SheetContent>
            </Sheet>
        </div>
    );
}
