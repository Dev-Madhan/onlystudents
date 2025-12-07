import {adminGetCourse} from "@/app/data/admin/admin-get-course";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {EditCourseForm} from "@/app/admin/courses/[courseId]/edit/_components/EditCourseForm";
import {CourseStructure} from "@/app/admin/courses/[courseId]/edit/_components/CourseStructure";

type Params = Promise<{ courseId: string }>;

export default async function EditRouter({params}: { params: Params }) {
    const {courseId} = await params;
    const data = await adminGetCourse(courseId);
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Edit Course: <span className="text-primary underline">{data.title}</span></h1>

            <Tabs defaultValue="basic-info">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
                    <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
                </TabsList>
                <TabsContent value="basic-info">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription className="font-medium font-serif">Edit basic information about the course</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EditCourseForm data={data}  />
                            </CardContent>
                        </Card>
                    </TabsContent>

                <TabsContent value="course-structure">
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Structure</CardTitle>
                                <CardDescription className="font-medium font-serif">Here you can update your Course Structure</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CourseStructure data={data} />
                            </CardContent>
                        </Card>
                    </TabsContent>
            </Tabs>
        </div>
    );
}