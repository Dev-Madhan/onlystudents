import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {useState, useTransition} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {chapterSchema, ChapterSchemaType} from "@/lib/zodSchema";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {tryCatch} from "@/hooks/try-catch";
import {createChapter} from "@/app/admin/courses/[courseId]/edit/action";
import {toast} from "sonner";


export function NewChapterModel({courseId}: { courseId: string}) {
    const [isOpen, setIsOpen] = useState(false);
    const [pending, startTransition] = useTransition()

        // 1. Define your form.
    const form = useForm<ChapterSchemaType>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            name: "",
            courseId: courseId,

        },
    });

    async function onSubmit(values: ChapterSchemaType) {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(createChapter(values));

            if(error) {
                toast.error("An unexpected error occurred. Please try again later.");
                return;
            }

            if(result.status === "success") {
                toast.success(result.message);
                form.reset();
                setIsOpen(false);
            } else if(result.status === "error") {
                toast.error(result.message);
            }
        })
    }

    function handleOpenChange(open: boolean) {
        if(!open) {
            form.reset();
        }
        setIsOpen(open);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="size-4"/> New Chapter
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-mono">Create new chapter</DialogTitle>
                    <DialogDescription className="font-serif font-medium">What would you like to name this chapter?</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input className="font-serif" placeholder="Chapter Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>

                        <DialogFooter>
                            <Button disabled={pending} type="submit" className="font-mono font-medium">
                                {pending ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}