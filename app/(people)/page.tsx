
import type { Metadata } from "next";
import Features from "@/components/sections/features";
import { Integrations } from "@/components/sections/integrations";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CtaSection } from "@/components/sections/cta-section";
import HeroSection from "@/components/sections/hero-section";
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




export default function Home() {

    return (
        <>
            <HeroSection />
            <Features />
            <Integrations />
            <TestimonialsSection />
            <CtaSection />
        </>
    );
}

