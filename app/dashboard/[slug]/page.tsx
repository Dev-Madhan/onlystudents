import { getInduvidualCourses } from "@/app/data/course/get-courses";
import { env } from "@/lib/env";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import {
  IconCategory2,
  IconChartBar,
  IconClock,
} from "@tabler/icons-react";
import Image from "next/image";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";

type Params = Promise<{ slug: string }>;

export default async function DashboardCoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getInduvidualCourses(slug);

  return (
    <div className="flex flex-col gap-8 w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground font-serif">{course.smallDescription}</p>
  
          <div className="flex flex-wrap gap-3 mt-2">
            <Badge className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-0">
              <IconChartBar className="size-4" />
              <span className="font-mono text-sm">{course.level}</span>
            </Badge>
  
            <Badge className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-0">
              <IconCategory2 className="size-4" />
              <span className="font-mono text-sm">{course.category}</span>
            </Badge>
  
            <Badge className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-0">
              <IconClock className="size-4" />
              <span className="font-mono text-sm">{course.duration}h</span>
            </Badge>
          </div>
        </div>

        {course.chapters?.[0]?.lessons?.[0]?.id && (
          <Button asChild size="lg" className="shrink-0 text-base font-semibold h-12 px-6 shadow-md">
            <Link href={`/dashboard/${slug}/${course.chapters[0].lessons[0].id}`}>
              <PlayCircle className="size-5 mr-2" />
              Start Learning
            </Link>
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg bg-black border border-muted">
          {course.demoVideoKey ? (
            <video
              src={`https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${course.demoVideoKey}`}
              controls
              preload="metadata"
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={`https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${course.fileKey}`}
              alt={course.title}
              fill
              priority
              className="object-cover"
            />
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>About this course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground leading-relaxed">
              {course.description ? (
                <RenderDescription json={JSON.parse(course.description)} />
              ) : (
                course.smallDescription
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
