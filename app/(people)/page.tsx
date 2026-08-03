
import type { Metadata } from "next";
import {buttonVariants} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Transform Your Educational Journey",
    description:
        "Experience a fresh approach to education with our dynamic, interactive learning management system. Unlock expert-led courses in web development, design, and more — accessible anytime, anywhere.",
    openGraph: {
        title: "Transform Your Educational Journey | Only Students",
        description:
            "Unlock expert-led courses in web development, design, and more. Start learning today with Only Students.",
        url: "https://only-student.vercel.app",
    },
    alternates: {
        canonical: "https://only-student.vercel.app",
    },
};


interface featureProps {
    title: string;
    description: string;
    icon: string;
}

const features : featureProps[] = [
    {
        title: 'Comprehensive Courses',
        description: "Access a wide range of carefully curated courses designed by industry experts.",
        icon: '📚'
    },
    {
        title: 'Interactive Learning',
        description: "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
        icon: '🎮',
    },
    {
      title: 'Progress Tracking',
      description: "Monitoring your progress and achievements with detailed analytics and personalized dashboards.",
      icon: '📊'
    },
    {
        title: 'Community Support',
        description: 'Join a vibrant community of learners and instructors to collaborate and share knowledge.',
        icon: '👥',
    }
]

export default function Home() {

    return (
        <>
            <section className="relative py-20">
                <div className="flex flex-col items-center text-center space-y-8">
                    <Badge variant="outline" className="font-serif font-medium">
                        The Evolution of Online Education
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Transform Your Educational Journey</h1>

                    <p className="max-w-[700px] text-muted-foreground md:text-xl font-serif">Experience a fresh approach to education with our dynamic, interactive learning management system. Unlock top-tier courses, accessible anytime, anywhere. </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8 font-mono font-medium">
                        <Link className={buttonVariants({
                            size: "lg",
                        })} href="/courses" >Explore Courses</Link>

                        <Link href='/login' className={buttonVariants({
                            size: "lg",
                            variant: "outline",
                        })}>Sign in</Link>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                {features.map((feature, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <CardTitle className="font-mono text-2xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-serif text-muted-foreground">{feature.description}</p>
                        </CardContent>

                    </Card>
                ))}
            </section>
        </>
    );
}
