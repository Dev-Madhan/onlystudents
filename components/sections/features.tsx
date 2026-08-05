'use client'

import { Card } from '@/components/ui/card'
import { Award, BookOpen, GraduationCap, Pause, Play } from 'lucide-react'
import { motion, Variants } from 'framer-motion'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: [0.25, 1, 0.5, 1],
        }
    }
}

export default function Features() {
    return (
        <section className="bg-background py-24">
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                @keyframes pulse-ring {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.7; }
                }
                @keyframes dot-orbit {
                    from { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
                    to { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
                }
                .animate-spin-slow { animation: spin-slow 12s linear infinite; }
                .animate-spin-reverse { animation: spin-reverse 18s linear infinite; }
                .animate-pulse-ring { animation: pulse-ring 3s ease-in-out infinite; }
                .animate-dot-orbit { animation: dot-orbit 8s linear infinite; }
            `}</style>
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="mx-auto max-w-6xl px-6"
            >
                <motion.div variants={itemVariants} className="text-center">
                    <h2 className="font-mono text-3xl md:text-4xl font-bold tracking-tight">
                        Why Choose Only Students
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto font-serif md:text-lg">
                        Everything you need to learn, grow, and succeed — all in one place.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto md:auto-rows-[280px]">

                    {/* Card 1: Structured Learning — spans 2 columns */}
                    <motion.div variants={itemVariants} className="md:col-span-2">
                        <Card className="h-full p-6 flex flex-col justify-between overflow-hidden min-h-[320px] md:min-h-0">
                        <div className="space-y-2">
                            <h3 className="text-foreground font-mono font-semibold text-lg">Structured Learning</h3>
                            <p className="text-muted-foreground font-serif text-sm max-w-md">
                                Follow a clear, chapter-by-chapter path designed to take you from beginner to proficient.
                            </p>
                        </div>
                        <div
                            aria-hidden
                            className="flex flex-col gap-3 pt-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        >
                            <div className="relative flex items-center gap-4 sm:gap-6 px-2 w-max">
                                <div className="bg-border absolute inset-0 my-auto h-px" />
                                <div className="bg-card shadow-sm border-2 border-border relative flex h-9 items-center gap-2 rounded-full px-4">
                                    <BookOpen className="size-4 text-primary" />
                                    <span className="text-xs font-mono text-muted-foreground">Chapter 1</span>
                                </div>
                                <div className="bg-card shadow-sm border-2 border-border relative flex h-9 items-center gap-2 rounded-full px-4">
                                    <BookOpen className="size-4 text-primary" />
                                    <span className="text-xs font-mono text-muted-foreground">Chapter 2</span>
                                </div>
                                <div className="bg-card shadow-sm border-2 border-border relative flex h-9 items-center gap-2 rounded-full px-4">
                                    <BookOpen className="size-4 text-primary" />
                                    <span className="text-xs font-mono text-muted-foreground">Chapter 3</span>
                                </div>
                            </div>
                            <div className="relative flex items-center gap-4 sm:gap-6 px-2 sm:px-8 w-max">
                                <div className="bg-border absolute inset-0 my-auto h-px" />
                                <div className="bg-card shadow-sm border-2 border-border relative flex h-9 items-center gap-2 rounded-full px-4">
                                    <BookOpen className="size-4 text-primary" />
                                    <span className="text-xs font-mono text-muted-foreground">Chapter 4</span>
                                </div>
                                <div className="bg-card shadow-sm border-2 border-border relative flex h-9 items-center gap-2 rounded-full px-4">
                                    <BookOpen className="size-4 text-primary" />
                                    <span className="text-xs font-mono text-muted-foreground">Chapter 5</span>
                                </div>
                                <div className="bg-card shadow-sm border-2 border-border relative flex h-9 items-center gap-2 rounded-full px-4">
                                    <GraduationCap className="size-4 text-primary" />
                                    <span className="text-xs font-mono text-muted-foreground">Complete</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                    </motion.div>

                    {/* Card 2: Live Progress — tall, spans 2 rows */}
                    <motion.div variants={itemVariants} className="md:row-span-2">
                        <Card className="h-full p-6 flex flex-col overflow-hidden min-h-[380px] md:min-h-0">
                        <div className="space-y-2">
                            <h3 className="text-foreground font-mono font-semibold text-lg">Live Progress</h3>
                            <p className="text-muted-foreground font-serif text-sm">
                                Track every lesson completed and see your growth unfold in real time.
                            </p>
                        </div>
                        <div
                            aria-hidden
                            className="relative flex-1 flex items-center justify-center scale-100 md:scale-[0.8] lg:scale-100"
                        >
                            {/* Crosshair lines */}
                            <div className="bg-foreground/10 absolute inset-0 mx-auto w-px" />
                            <div className="bg-foreground/10 absolute inset-0 my-auto h-px" />

                            {/* Outer ring - slow spin */}
                            <div className="animate-spin-slow absolute size-48 rounded-full border-2 border-border" />
                            {/* Outer ring primary arc */}
                            <div
                                className="animate-spin-slow absolute size-48 rounded-full border-2 border-transparent"
                                style={{
                                    borderTopColor: 'var(--primary)',
                                    borderRightColor: 'var(--primary)',
                                    opacity: 0.6,
                                }}
                            />

                            {/* Middle ring */}
                            <div className="animate-spin-reverse absolute size-32 rounded-full border-2 border-border animate-pulse-ring" />
                            <div
                                className="animate-spin-reverse absolute size-32 rounded-full border-2 border-transparent"
                                style={{
                                    borderBottomColor: 'var(--primary)',
                                    borderLeftColor: 'var(--primary)',
                                    opacity: 0.5,
                                }}
                            />

                            {/* Inner ring */}
                            <div className="animate-spin-slow absolute size-16 rounded-full border-2 border-border" />
                            <div
                                className="animate-spin-slow absolute size-16 rounded-full border-2 border-transparent"
                                style={{
                                    borderTopColor: 'var(--primary)',
                                    opacity: 0.8,
                                }}
                            />

                            {/* Center dot */}
                            <div className="relative size-3 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />

                            {/* Orbiting dot on outer ring */}
                            <div
                                className="animate-dot-orbit absolute"
                                style={{ '--orbit-radius': '96px' } as React.CSSProperties}
                            >
                                <div className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                            </div>
                        </div>
                    </Card>
                    </motion.div>

                    {/* Card 3: Self-Paced Study — spans 2 columns */}
                    <motion.div variants={itemVariants} className="md:col-span-2">
                        <Card className="h-full p-6 flex flex-col justify-between overflow-hidden min-h-[320px] md:min-h-0">
                        <div className="space-y-2">
                            <h3 className="text-foreground font-mono font-semibold text-lg">Self-Paced Study</h3>
                            <p className="text-muted-foreground font-serif text-sm max-w-md">
                                Learn at your own speed. Revisit lessons anytime, anywhere.
                            </p>
                        </div>
                        <div
                            aria-hidden
                            className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-6 pt-6"
                        >
                            {/* Timeline blocks */}
                            <div className="flex flex-col sm:flex-row gap-6 w-full xl:flex-1">
                                <div className="flex flex-col gap-2 flex-1 w-full">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-primary" />
                                        <div className="h-px flex-1 bg-border" />
                                        <span className="text-[10px] font-mono text-muted-foreground">Week 1</span>
                                    </div>
                                    <div className="ml-4 flex gap-1.5">
                                        {[1,2,3,4,5].map(i => (
                                            <div key={i} className="h-6 flex-1 rounded-sm bg-primary/20 border-2 border-primary/30" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 flex-1 w-full">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-primary" />
                                        <div className="h-px flex-1 bg-border" />
                                        <span className="text-[10px] font-mono text-muted-foreground">Week 2</span>
                                    </div>
                                    <div className="ml-4 flex gap-1.5">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="h-6 flex-1 rounded-sm bg-primary/40 border-2 border-primary/50" />
                                        ))}
                                        {[4,5].map(i => (
                                            <div key={i} className="h-6 flex-1 rounded-sm bg-border/50 border-2 border-border" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Controls */}
                            <div className="flex flex-row xl:flex-col gap-2 shrink-0 xl:pb-1 w-full xl:w-auto justify-end">
                                <div className="bg-card shadow-sm border-2 border-border flex h-8 items-center gap-1.5 rounded-full px-3">
                                    <Play className="size-3 text-primary fill-primary" />
                                    <span className="text-[10px] font-mono text-muted-foreground">Resume</span>
                                </div>
                                <div className="bg-card shadow-sm border-2 border-border flex h-8 items-center gap-1.5 rounded-full px-3">
                                    <Pause className="size-3 text-muted-foreground" />
                                    <span className="text-[10px] font-mono text-muted-foreground">Pause</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                    </motion.div>

                </div>

                {/* Bottom full-width card: Verified Certificates */}
                <motion.div variants={itemVariants} className="mt-4">
                    <Card className="h-full p-8 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="pointer-events-none relative flex size-32 shrink-0 items-center justify-center">
                            <Award className="absolute inset-0 size-full stroke-[0.3px] opacity-10 text-primary" />
                            <Award className="size-20 stroke-[0.5px] text-primary" />
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-foreground font-mono font-semibold text-lg">Verified Certificates</h3>
                            <p className="text-muted-foreground font-serif text-sm max-w-lg">
                                Earn certificates upon course completion to showcase your skills and stand out to employers. Share them directly on LinkedIn and your portfolio.
                            </p>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </section>
    )
}
