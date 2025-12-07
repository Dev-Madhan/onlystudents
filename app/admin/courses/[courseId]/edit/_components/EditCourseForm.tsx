"use client";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2, PlusIcon, SparkleIcon} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {RichTextEditor} from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploader/Uploader";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {courseCategories, courseLevels, courseSchema, CourseSchemaType, courseStatus} from "@/lib/zodSchema";
import {Control, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import slugify from "slugify";
import {useTransition} from "react";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {editCourse} from "@/app/admin/courses/[courseId]/edit/action";
import {AdminCourseSingularType} from "@/app/data/admin/admin-get-course";

interface iAppProps {
    data: AdminCourseSingularType;
}

// --- 1. LOGIC HELPER: Fixes duplication on the IF statements ---
// By moving the response logic here, we break the "duplicate code" pattern in onSubmit
function processServerResponse(
    result: any,
    error: any,
    onSuccess: () => void
) {
    if (error) {
        toast.error("An unexpected error occurred. Please try again later.");
        return;
    }

    if (result?.status === "success") {
        toast.success(result.message);
        onSuccess();
    } else if (result?.status === "error") {
        toast.error(result.message);
    }
}

// --- 2. JSX HELPERS: Fixes duplication on Inputs/Selects ---

interface FormInputProps {
    control: Control<CourseSchemaType>;
    name: keyof CourseSchemaType;
    label: string;
    placeholder: string;
    type?: string;
    className?: string;
}

const FormInput = ({ control, name, label, placeholder, type = "text", className }: FormInputProps) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input
                        className="font-medium font-serif text-sm"
                        placeholder={placeholder}
                        type={type}
                        {...field}
                        value={field.value?.toString() || ""}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

interface FormSelectProps {
    control: Control<CourseSchemaType>;
    name: keyof CourseSchemaType;
    label: string;
    placeholder: string;
    options: readonly string[];
}

const FormSelect = ({ control, name, label, placeholder, options }: FormSelectProps) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className="w-full">
                <FormLabel>{label}</FormLabel>
                <Select value={field.value as string} onValueChange={field.onChange}>
                    <FormControl>
                        <SelectTrigger className="w-full font-serif font-medium">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent className="font-serif font-medium">
                        {options.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}
    />
);

// --- 3. MAIN COMPONENT ---

export function EditCourseForm({data}: iAppProps) {
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: data.title,
            description: data.description,
            fileKey: data.fileKey,
            price: data.price,
            duration: data.duration,
            level: data.level,
            category: data.category as CourseSchemaType["category"],
            status: data.status,
            slug: data.slug,
            smallDescription: data.smallDescription,
        },
    });

    function onSubmit(values: CourseSchemaType) {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(editCourse(values, data.id));

            // Refactored to use helper, resolving the duplicate IF statement error
            processServerResponse(result, error, () => {
                form.reset();
                router.push("/admin/courses");
            });
        })
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>

                {/* Title */}
                <FormInput
                    control={form.control}
                    name="title"
                    label="Title"
                    placeholder="Title"
                />

                {/* Slug */}
                <div className="flex gap-4 items-end">
                    <FormInput
                        control={form.control}
                        name="slug"
                        label="Slug"
                        placeholder="Slug"
                        className="w-full"
                    />

                    <Button
                        type="button"
                        className="w-fit font-mono font-medium"
                        onClick={() => {
                            const titleValue = form.getValues("title").trim();
                            if (!titleValue) {
                                form.setError("title", {message: "Please enter a title before generating a slug"});
                                return;
                            }
                            const slug = slugify(titleValue, { lower: true, strict: true, trim: true });
                            form.setValue("slug", slug, {shouldValidate: true});
                        }}
                    >
                        Generate Slug <SparkleIcon className="ml-1" size={16}/>
                    </Button>
                </div>

                {/* Small Description */}
                <FormField
                    control={form.control}
                    name="smallDescription"
                    render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Small Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="font-medium font-serif text-sm min-h-[120px]"
                                    placeholder="Small Description"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <RichTextEditor field={field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Thumbnail */}
                <FormField
                    control={form.control}
                    name="fileKey"
                    render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Thumbnail Image</FormLabel>
                            <FormControl>
                                <Uploader onChange={field.onChange} value={field.value}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Category / Level / Duration / Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                        control={form.control}
                        name="category"
                        label="Category"
                        placeholder="Select Category"
                        options={courseCategories}
                    />

                    <FormSelect
                        control={form.control}
                        name="level"
                        label="Level"
                        placeholder="Select Level"
                        options={courseLevels}
                    />

                    <FormInput
                        control={form.control}
                        name="duration"
                        label="Duration (hours)"
                        placeholder="Duration"
                        type="number"
                        className="w-full"
                    />

                    <FormInput
                        control={form.control}
                        name="price"
                        label="Price (₹)"
                        placeholder="Price"
                        type="number"
                        className="w-full"
                    />
                </div>

                {/* Status */}
                <FormSelect
                    control={form.control}
                    name="status"
                    label="Status"
                    placeholder="Select Status"
                    options={courseStatus}
                />

                <Button type="submit" disabled={pending} className="font-mono font-medium">
                    {pending ? (
                        <>Updating...<Loader2 className="animate-spin ml-1"/></>
                    ) : (
                        <>Update Course <PlusIcon className="ml-1 font-medium" size={16}/></>
                    )}
                </Button>
            </form>
        </Form>
    )
}