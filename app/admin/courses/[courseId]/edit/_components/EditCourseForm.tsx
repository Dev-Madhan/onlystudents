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
import { useForm } from "react-hook-form";
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

/* =========================================================
   PROPS
   ========================================================= */

interface EditCourseFormProps {
  data: AdminCourseSingularType;
}

/* =========================================================
   COMPONENT
   ========================================================= */

export function EditCourseForm({ data }: EditCourseFormProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema) as any,
    mode: "onSubmit",
    defaultValues: {
      title: data.title,
      description: data.description,
      smallDescription: data.smallDescription,
      slug: data.slug,
      fileKey: data.fileKey,
      demoVideoKey: data.demoVideoKey ?? "",
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
        editCourse(values, data.id),
      );

      if (error) {
        toast.error("Something went wrong");
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message);
        router.push("/admin/courses");
      } else {
        toast.error(result?.message ?? "Update failed");
      }
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SLUG */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-end">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            className="w-full sm:w-auto shrink-0"
            onClick={() => {
              const title = form.getValues("title").trim();
              if (!title) return;

              form.setValue(
                "slug",
                slugify(title, { lower: true, strict: true }),
                { shouldValidate: true },
              );
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
                <Textarea {...field} />
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
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DEMO VIDEO */}
        <FormField
          control={form.control}
          name="demoVideoKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demo Video / Preview Video</FormLabel>
              <FormControl>
                <Uploader
                  fileTypeAccepted="demoVideo"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CATEGORY / LEVEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CATEGORY */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full font-medium font-mono">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="font-medium font-mono">
                    {courseCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* LEVEL */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Level</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl className="font-medium font-mono">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="font-medium font-mono">
                    {courseLevels.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* STATUS */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full font-medium font-mono">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="font-medium font-mono">
                  {courseStatus.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SUBMIT */}
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              Updating <Loader2 className="ml-1 animate-spin" />
            </>
          ) : (
            <>
              Update Course <PlusIcon className="ml-1" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
