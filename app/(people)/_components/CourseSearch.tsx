"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export function CourseSearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const initialQuery = searchParams.get('q')?.toString() || "";
    const [value, setValue] = useState(initialQuery);

    // Sync input with url changes (e.g. going back in history)
    useEffect(() => {
        setValue(searchParams.get('q')?.toString() || "");
    }, [searchParams]);

    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSearch = useCallback(
        debounce((term: string) => {
            const params = new URLSearchParams(searchParams);
            if (term) {
                params.set('q', term);
            } else {
                params.delete('q');
            }
            replace(`${pathname}?${params.toString()}`, { scroll: false });
        }, 300),
        [searchParams, pathname, replace]
    );

    return (
        <div className="relative w-full sm:w-80">
            <Input
                type="text"
                placeholder="Search courses..."
                className="pr-10 bg-background/50 backdrop-blur-sm border-border rounded-md shadow-sm"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    handleSearch(e.target.value);
                }}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
    );
}
