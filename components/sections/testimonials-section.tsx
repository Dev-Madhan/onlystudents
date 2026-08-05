"use client";

import { cn } from "@/lib/utils";
import { InfiniteSlider } from "@/components/sections/infinite-slider";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
    }
};

type Testimonial = {
	quote: string;
	image: string;
	name: string;
	role: string;
	company?: string;
};

const testimonials: Testimonial[] = [
	{
		quote:
			"This platform completely changed how I study. The structured learning paths make complex concepts so much easier to grasp.",
		image: "https://randomuser.me/api/portraits/women/11.jpg",
		name: "Sarah Jenkins",
		role: "Computer Science Student",
		company: "Stanford University",
	},
	{
		quote:
			"I landed my first junior developer role after finishing the advanced React course here. The verified certificates actually hold weight with employers.",
		image: "https://randomuser.me/api/portraits/men/22.jpg",
		name: "David Chen",
		role: "Junior Frontend Developer",
		company: "TechNova",
	},
	{
		quote:
			"The live progress tracking keeps me motivated. It's incredibly satisfying to watch the rings fill up as I complete each chapter.",
		image: "https://randomuser.me/api/portraits/women/33.jpg",
		name: "Elena Rodriguez",
		role: "Self-Taught Developer",
	},
	{
		quote:
			"I love how I can integrate my Notion workspace directly. I keep all my study notes synced while I go through the video lessons.",
		image: "https://randomuser.me/api/portraits/men/44.jpg",
		name: "Michael Chang",
		role: "Software Engineering Intern",
		company: "Google",
	},
	{
		quote:
			"Finally, an educational platform that doesn't look like it was built in 2005. The UI is gorgeous and learning feels genuinely premium.",
		image: "https://randomuser.me/api/portraits/women/55.jpg",
		name: "Jessica Taylor",
		role: "UI/UX Design Student",
	},
	{
		quote:
			"The self-paced study controls are perfect. I can pause my subscription during finals week and pick right back up when I have free time.",
		image: "https://randomuser.me/api/portraits/men/66.jpg",
		name: "Omar Farooq",
		role: "Information Technology Major",
	},
	{
		quote:
			"I've tried a lot of coding bootcamps and online courses, but this is the first one that felt like it was actually built with students in mind.",
		image: "https://randomuser.me/api/portraits/women/77.jpg",
		name: "Rachel Kim",
		role: "Recent Bootcamp Grad",
	},
	{
		quote:
			"The verified certificates were super easy to add to my LinkedIn profile. Got three recruiter messages the same week I posted them!",
		image: "https://randomuser.me/api/portraits/men/88.jpg",
		name: "James Wilson",
		role: "Web Development Student",
	},
	{
		quote:
			"Every chapter flows perfectly into the next. It's like having a senior developer sitting next to you guiding you through the tough parts.",
		image: "https://randomuser.me/api/portraits/women/99.jpg",
		name: "Anita Patel",
		role: "Career Switcher",
	},
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function TestimonialsSection() {
	return (
		<section className="relative py-10">
			<motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="mx-auto max-w-5xl"
            >
				<div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4">


					<motion.h2 variants={itemVariants} className="text-center font-bold text-3xl tracking-tighter lg:text-4xl">
						Loved by students worldwide
					</motion.h2>
					<motion.p variants={itemVariants} className="text-center text-muted-foreground text-sm">
						Join thousands of learners who are advancing their careers on our platform.
					</motion.p>
				</div>

				<motion.div
                    variants={itemVariants}
					className={cn(
						"mt-10 flex max-h-160 justify-center gap-6 overflow-hidden",
						"mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
					)}
				>
					<InfiniteSlider direction="vertical" speed={30} speedOnHover={15}>
						{firstColumn.map((testimonial) => (
							<TestimonialsCard
								key={testimonial.name}
								testimonial={testimonial}
							/>
						))}
					</InfiniteSlider>
					<InfiniteSlider
						className="hidden md:block"
						direction="vertical"
						speed={50}
						speedOnHover={25}
					>
						{secondColumn.map((testimonial) => (
							<TestimonialsCard
								key={testimonial.name}
								testimonial={testimonial}
							/>
						))}
					</InfiniteSlider>
					<InfiniteSlider
						className="hidden lg:block"
						direction="vertical"
						speed={35}
						speedOnHover={17}
					>
						{thirdColumn.map((testimonial) => (
							<TestimonialsCard
								key={testimonial.name}
								testimonial={testimonial}
							/>
						))}
					</InfiniteSlider>
				</motion.div>
			</motion.div>
		</section>
	);
}

function TestimonialsCard({
	testimonial,
	className,
	...props
}: React.ComponentProps<"figure"> & {
	testimonial: Testimonial;
}) {
	const { quote, image, name, role, company } = testimonial;
	return (
		<figure
			className={cn(
				"w-full max-w-xs rounded-3xl border bg-card p-8 shadow-foreground/10 shadow-lg dark:bg-card/20",
				className
			)}
			{...props}
		>
			<blockquote>{quote}</blockquote>
			<figcaption className="mt-5 flex items-center gap-2">
				<Avatar className="size-8 rounded-full">
					<AvatarImage alt={`${name}'s profile picture`} src={image} />
					<AvatarFallback>{name.charAt(0)}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<cite className="font-medium not-italic leading-5 tracking-tight">
						{name}
					</cite>
					<span className="text-muted-foreground text-sm leading-5 tracking-tight">
						{role} {company && `, ${company}`}
					</span>
				</div>
			</figcaption>
		</figure>
	);
}
