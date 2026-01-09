"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PlusIcon, SparkleIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploader/Uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  courseCategories,
  courseLevels,
  courseSchema,
  CourseSchemaType,
  courseStatus,
} from "@/lib/zodSchema";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import slugify from "slugify";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { editCourse } from "@/app/admin/courses/[courseId]/edit/action";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

interface iAppProps {
  data: AdminCourseSingularType;
}

type ServerActionResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string };

/* -------------------------------------------------------------------------- */
/*                          SERVER RESPONSE HANDLER                            */
/* -------------------------------------------------------------------------- */

function processServerResponse(
  result: ServerActionResult | null,
  error: unknown,
  onSuccess: () => void
) {
  if (error) {
    toast.error("An unexpected error occurred. Please try again.");
    return;
  }

  if (result?.status === "success") {
    toast.success(result.message);
    onSuccess();
  } else if (result?.status === "error") {
    toast.error(result.message);
  }
}

/* -------------------------------------------------------------------------- */
/*                              REUSABLE INPUT                                */
/* -------------------------------------------------------------------------- */

interface FormInputProps {
  control: Control<CourseSchemaType>;
  name: keyof CourseSchemaType;
  label: string;
  placeholder: string;
  type?: "text" | "number";
  className?: string;
}

const FormInput = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  className,
}: FormInputProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            className="font-medium font-serif text-sm"
            value={type === "number" ? field.value ?? "" : field.value}
            onChange={(e) => {
              const value =
                type === "number" ? Number(e.target.value) : e.target.value;
              field.onChange(value);
            }}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

/* -------------------------------------------------------------------------- */
/*                              REUSABLE SELECT                               */
/* -------------------------------------------------------------------------- */

interface FormSelectProps {
  control: Control<CourseSchemaType>;
  name: keyof CourseSchemaType;
  label: string;
  placeholder: string;
  options: readonly string[];
}

const FormSelect = ({
  control,
  name,
  label,
  placeholder,
  options,
}: FormSelectProps) => (
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

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export function EditCourseForm({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    mode: "onSubmit",
    shouldUnregister: false,
    defaultValues: {
      title: data.title,
      description: data.description,
      smallDescription: data.smallDescription,
      slug: data.slug,
      fileKey: data.fileKey,
      price: data.price,
      duration: data.duration,
      level: data.level,
      category: data.category as CourseSchemaType["category"],
      status: data.status,
    },
  });

  function onSubmit(values: CourseSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        editCourse(values, data.id)
      );

      processServerResponse(
        (result ?? null) as ServerActionResult | null,
        error,
        () => {
          form.reset();
          router.push("/admin/courses");
        }
      );
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* TITLE */}
        <FormInput
          control={form.control}
          name="title"
          label="Title"
          placeholder="Course title"
        />

        {/* SLUG */}
        <div className="flex gap-4 items-end">
          <FormInput
            control={form.control}
            name="slug"
            label="Slug"
            placeholder="course-slug"
            className="w-full"
          />

          <Button
            type="button"
            className="font-mono font-medium"
            onClick={() => {
              const title = form.getValues("title").trim();
              if (!title) {
                form.setError("title", {
                  message: "Enter title before generating slug",
                });
                return;
              }
              const slug = slugify(title, {
                lower: true,
                strict: true,
                trim: true,
              });
              form.setValue("slug", slug, { shouldValidate: true });
            }}
          >
            Generate <SparkleIcon className="ml-1" size={16} />
          </Button>
        </div>

        {/* SMALL DESCRIPTION */}
        <FormField
          control={form.control}
          name="smallDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Small Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Short description"
                  className="min-h-[120px] font-serif font-medium"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DESCRIPTION */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* THUMBNAIL */}
        <FormField
          control={form.control}
          name="fileKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail Image</FormLabel>
              <FormControl>
                <Uploader
                  fileTypeAccepted="image"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    void form.trigger("fileKey"); // ✅ FIXED (no promise warning)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            control={form.control}
            name="category"
            label="Category"
            placeholder="Select category"
            options={courseCategories}
          />

          <FormSelect
            control={form.control}
            name="level"
            label="Level"
            placeholder="Select level"
            options={courseLevels}
          />

          <FormInput
            control={form.control}
            name="duration"
            label="Duration (hours)"
            placeholder="Duration"
            type="number"
          />

          <FormInput
            control={form.control}
            name="price"
            label="Price (₹)"
            placeholder="Price"
            type="number"
          />
        </div>

        {/* STATUS */}
        <FormSelect
          control={form.control}
          name="status"
          label="Status"
          placeholder="Select status"
          options={courseStatus}
        />

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={pending || !form.watch("fileKey")}
          className="font-mono font-medium"
        >
          {pending ? (
            <>
              Updating <Loader2 className="ml-1 animate-spin" />
            </>
          ) : (
            <>
              Update Course <PlusIcon className="ml-1" size={16} />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
