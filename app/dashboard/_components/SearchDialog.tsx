"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { searchCourses } from "@/app/actions/search-courses";

interface SearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ id: string; slug: string; title: string; category: string | null; thumbnailUrl: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(async () => {
            try {
                const courses = await searchCourses(query);
                setResults(courses);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Handle closing the dialog and clearing state
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setQuery("");
            setResults([]);
        }
        onOpenChange(isOpen);
    };

    const handleSelect = (slug: string) => {
        handleOpenChange(false);
        router.push(`/courses/${slug}`);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-[550px] p-0 overflow-hidden shadow-2xl rounded-xl">
                <DialogTitle className="sr-only">Search</DialogTitle>
                <Command shouldFilter={false} className="bg-background">
                    <CommandInput
                        placeholder="Search for courses..."
                        value={query}
                        onValueChange={setQuery}
                        className="h-12 sm:h-14 text-sm sm:text-base"
                    />
                    <CommandList className="max-h-[400px]">
                        <CommandEmpty className="p-6 text-center text-sm text-muted-foreground">
                            {isLoading ? "Searching catalog..." : query ? "No courses found." : "Type a course name to search."}
                        </CommandEmpty>
                        
                        {results.length > 0 && (
                            <CommandGroup heading="Results">
                                {results.map((course) => (
                                    <CommandItem
                                        key={course.id}
                                        value={course.slug}
                                        onSelect={() => handleSelect(course.slug)}
                                        className="flex items-center gap-3 p-3 cursor-pointer"
                                    >
                                        {course.thumbnailUrl ? (
                                            <img 
                                                src={course.thumbnailUrl} 
                                                alt={course.title}
                                                className="w-10 h-10 rounded-md object-cover border"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-xs border">
                                                Img
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{course.title}</span>
                                            {course.category && (
                                                <span className="text-xs text-muted-foreground">{course.category}</span>
                                            )}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
}
