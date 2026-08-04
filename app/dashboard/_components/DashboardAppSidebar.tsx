"use client"

import * as React from "react"
import Logo from "@/app/src/assets/images/Logo.png";
import {
    IconChartBar,
    IconDashboard,
    IconFolder,
    IconHelp,
    IconListDetails,
    IconSearch,
    IconSettings,
    IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import Image from "next/image";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "My Courses",
            url: "/dashboard",
            icon: IconDashboard,
        },
        {
            title: "Browse Catalog",
            url: "/dashboard/courses",
            icon: IconListDetails,
        },
        {
            title: "Billing",
            url: "/dashboard/billing",
            icon: IconChartBar,
        },
    ],
};

import { SettingsDialog } from "./SettingsDialog";
import { SearchDialog } from "./SearchDialog";

export function DashboardAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [searchOpen, setSearchOpen] = React.useState(false);

    const navSecondary = [
        {
            title: "Settings",
            icon: IconSettings,
            onClick: () => setSettingsOpen(true),
        },
        {
            title: "Get Help",
            icon: IconHelp,
            url: "mailto:devmadhan24@gmail.com",
        },
        {
            title: "Search",
            icon: IconSearch,
            onClick: () => setSearchOpen(true),
        },
    ];

    return (
        <>
            <Sidebar collapsible="offcanvas" {...props}>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                className="data-[slot=sidebar-menu-button]:!p-1.5"
                            >
                                <Link href="/">
                                    <Image src={Logo} alt='Logo' className='h-5 w-auto object-contain' />
                                    <span className="text-base font-mono font-semibold">Only Students</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <NavMain items={data.navMain} />
                    <NavSecondary items={navSecondary} className="mt-auto" />
                </SidebarContent>
                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>

            <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </>
    )
}
