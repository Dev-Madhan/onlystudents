"use client";

import Link from "next/link";
import Image from "next/image";
import { BookIcon, HouseIcon, LayoutDashboardIcon } from "lucide-react";

import { ThemeToggle } from "@/components/ui/themeToggle";
import { UserDropdown } from "@/app/(people)/_components/UserDropdown";
import { buttonVariants } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { authClient } from "@/lib/auth-client";

import Logo from "@/app/src/assets/images/Logo.png";

const navigationLinks = [
    { href: "/", label: "Home", icon: HouseIcon, active: true },
    { href: "/courses", label: "Courses", icon: BookIcon },
    { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
];

export default function Navbar() {
    const { data: session, isPending } = authClient.useSession();

    return (
        <header className="border-b px-4 md:px-6">
            <div className="flex h-16 items-center justify-between gap-4">
                {/* Left: Navigation (hidden on mobile) */}
                <div className="hidden md:flex flex-1 items-center gap-2">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-4">
                            {navigationLinks.map((link, index) => {
                                const Icon = link.icon;
                                return (
                                    <NavigationMenuItem key={index}>
                                        <NavigationMenuLink
                                            href={link.href}
                                            className="flex-row items-center gap-2 py-1.5 font-medium text-foreground hover:text-primary"
                                        >
                                            <Icon
                                                size={16}
                                                className="text-muted-foreground/80 font-medium"
                                                aria-hidden="true"
                                            />
                                            <span className="font-mono">{link.label}</span>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                );
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Center: Logo */}
                <div className="flex flex-1 justify-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src={Logo} alt="Logo" className="size-9" />
                        <span className="font-bold font-mono text-base">Only Students</span>
                    </Link>
                </div>

                {/* Right: Theme Toggle + Auth Buttons */}
                <div className="flex flex-1 items-center justify-end space-x-3 font-mono font-medium">
                    <ThemeToggle />
                    {isPending ? null : session ? (
                        <UserDropdown
                            email={session.user.email}
                            name={session?.user.name && session.user.name.length > 0
                                ? session.user.name
                                : session?.user.email.split("@")[0]}
                            image={session?.user.image ?? `https://avatar.vercel.sh/${session?.user.email}`}
                        />
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={buttonVariants({ variant: "secondary" })}
                            >
                                Login
                            </Link>
                            <Link href="/login" className={buttonVariants()}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
