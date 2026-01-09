import Link from "next/link";

const links = [
    { title: "Home", href: "/" },
    { title: "Courses", href: "/courses" },
    { title: "Dashboard", href: "/admin" },
];

export default function FooterSection() {
    return (
        <footer className="w-full bg-white py-12 dark:bg-transparent">
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:gap-6 md:text-left">

                    {/* Copyright */}
                    <span className="text-sm text-muted-foreground font-mono font-medium md:text-sm">
                        © {new Date().getFullYear()} Only Students, All rights reserved
                    </span>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-5 text-sm md:justify-end md:gap-6">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-muted-foreground transition font-mono font-medium hover:text-primary"
                            >
                                {link.title}
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </footer>
    );
}
