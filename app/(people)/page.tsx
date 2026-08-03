
import type { Metadata } from "next";
import {buttonVariants} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import Features from "@/components/features";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { BookTextIcon } from "@/components/ui/book-text";
import { HandMetalIcon } from "@/components/ui/hand-metal";
import { ChartColumnIncreasingIcon } from "@/components/ui/chart-column-increasing";
import { UsersIcon } from "@/components/ui/users";
import React from "react";

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
    icon: React.ReactNode;
}

const features : featureProps[] = [
    {
        title: 'Comprehensive Courses',
        description: "Access a wide range of carefully curated courses designed by industry experts.",
        icon: <BookTextIcon size={40} className="text-primary" />
    },
    {
        title: 'Interactive Learning',
        description: "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
        icon: <HandMetalIcon size={40} className="text-primary" />
    },
    {
      title: 'Progress Tracking',
      description: "Monitoring your progress and achievements with detailed analytics and personalized dashboards.",
      icon: <ChartColumnIncreasingIcon size={40} className="text-primary" />
    },
    {
        title: 'Community Support',
        description: 'Join a vibrant community of learners and instructors to collaborate and share knowledge.',
        icon: <UsersIcon size={40} className="text-primary" />
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

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="mb-4 flex items-center">{feature.icon}</div>
                            <CardTitle className="font-mono text-2xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-serif text-muted-foreground">{feature.description}</p>
                        </CardContent>

                    </Card>
                ))}
            </section>

            <Features />
        </>
    );
}
