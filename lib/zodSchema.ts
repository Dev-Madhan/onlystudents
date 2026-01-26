import { z } from "zod";

/* =========================================================
   CONSTANTS
   ========================================================= */

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;

export const courseStatus = ["Draft", "Published", "Archived"] as const;

export const courseCategories = [
  "Programming",
  "Design",
  "Gaming",
  "Business",
  "It & Software",
  "Video Editing",
  "Office productivity",
  "Personal Development",
  "Health & Fitness",
  "Teaching & Academics",
] as const;

/* =========================================================
   COURSE SCHEMA
   ========================================================= */

/**
 * NOTE:
 * - category is stored as STRING in Prisma
 * - but restricted via enum in UI
 * - Zod enum is safe and correct here
 */

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 100 characters long"),

  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),

  smallDescription: z
    .string()
    .min(3, "Small description must be at least 3 characters long")
    .max(200, "Small description must be at most 200 characters long"),

  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters long"),

  fileKey: z
    .string()
    .min(1, "Thumbnail image is required"),

  /** ✅ Optional demo / preview video */
  demoVideoKey: z
    .string()
    .optional()
    .or(z.literal("")),

  price: z.coerce
    .number()
    .min(1, "Price must be a positive number"),

  duration: z.coerce
    .number()
    .min(1, "Duration must be at least 1 hour")
    .max(500, "Duration must be at most 500 hours"),

  level: z.enum(courseLevels),

  category: z.enum(courseCategories),

  status: z.enum(courseStatus),
});

/* =========================================================
   CHAPTER SCHEMA
   ========================================================= */

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, "Chapter name must be at least 3 characters long"),

  courseId: z
    .string()
    .uuid("Course ID is invalid"),
});

/* =========================================================
   LESSON SCHEMA
   ========================================================= */

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, "Lesson name must be at least 3 characters long"),

  courseId: z
    .string()
    .uuid("Course ID is invalid"),

  chapterId: z
    .string()
    .uuid("Chapter ID is invalid"),

  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .optional(),

  thumbnailKey: z.string().optional(),

  videoKey: z.string().optional(),
});

/* =========================================================
   TYPES
   ========================================================= */

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
