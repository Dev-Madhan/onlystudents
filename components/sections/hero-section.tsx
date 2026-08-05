"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import Image from 'next/image'
import heroImage from '@/app/src/assets/images/hero-image.png'
import { motion, Variants } from 'framer-motion'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15, filter: "blur(8px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 1.2,
            ease: [0.25, 1, 0.5, 1],
        }
    }
}

const imageVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.96, filter: "blur(12px)" },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 1.6,
            delay: 0.3,
            ease: [0.25, 1, 0.5, 1],
        }
    }
}

export default function HeroSection() {
    return (
        <main className="overflow-hidden">
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <div className="mx-auto max-w-7xl">
                            <motion.div 
                                variants={containerVariants} 
                                initial="hidden" 
                                animate="show"
                                className="px-6 text-center sm:mx-auto lg:mr-auto lg:mt-0"
                            >
                                <motion.div variants={itemVariants}>
                                    <Link
                                        href="#link"
                                        className="group mx-auto flex w-fit items-center gap-2 rounded-full border-2 border-border bg-background p-1 pl-4 pr-1 text-sm font-medium shadow-sm">
                                        <span className="text-foreground pl-1">Unlock Your Potential</span>

                                        <div className="ml-2 size-6 overflow-hidden rounded-full bg-muted duration-500 group-hover:bg-primary">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3 text-muted-foreground transition-colors group-hover:text-primary-foreground" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3 text-muted-foreground transition-colors group-hover:text-primary-foreground" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>

                                <motion.h1 variants={itemVariants} className="mx-auto mt-6 w-full font-sans text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:mt-12 xl:whitespace-nowrap xl:text-7xl">
                                    Empower Your <br className="block sm:hidden" />
                                    Learning Journey
                                </motion.h1>
                                <motion.p variants={itemVariants} className="text-muted-foreground mx-auto mt-4 max-w-2xl text-balance md:text-lg">
                                    <span className="sm:hidden">
                                        Unlock top-tier interactive courses, accessible anytime, anywhere.
                                    </span>
                                    <span className="hidden sm:inline">
                                        Experience a fresh approach to education. Unlock top-tier courses with our interactive platform, accessible anytime, anywhere.
                                    </span>
                                </motion.p>

                                <motion.div variants={itemVariants} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    <Link href="/courses" className={buttonVariants({ variant: 'default', className: 'w-full sm:w-auto' })}>
                                        <span className="text-nowrap">Explore Courses</span>
                                    </Link>

                                    <Link href="/login" className={buttonVariants({ variant: 'ghost', className: 'w-full sm:w-auto' })}>
                                        <span className="text-nowrap">Sign in</span>
                                    </Link>
                                </motion.div>
                            </motion.div>

                            <motion.div 
                                variants={imageVariants}
                                initial="hidden"
                                animate="show"
                                className="relative mt-8 overflow-hidden p-2 sm:p-6 sm:mt-16"
                            >
                                <div className="rounded-4xl mask-t-from-25% mask-t-to-65% bg-linear-to-b absolute inset-0 border to-zinc-600"></div>
                                <div className="bg-background ring-foreground/6.5 before:mask-radial-at-top-left before:mask-radial-from-65% before:mask-radial-[100%_60%] before:ring-foreground before:border-foreground/10 relative rounded-2xl p-2 shadow-xl shadow-black/50 ring before:absolute before:-inset-px before:z-10 before:size-56 before:rounded-tl-2xl before:border-l before:border-t">
                                    <div className="bg-foreground/2 z-1 absolute inset-0 rounded-2xl"></div>
                                    <Image
                                        className="bg-background aspect-15/8 relative rounded-2xl object-cover"
                                        src={heroImage}
                                        alt="hero image"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>
    )
}
