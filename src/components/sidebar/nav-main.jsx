"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
    LayoutDashboard,
    Users,
    BookOpen,
    Microscope,
    Image as GalleryIcon,
    Settings,
    BadgeHelp,
    Network,
    Calendar,
    FolderOpenDot,
} from "lucide-react";

export function NavMain() {
    const pathname = usePathname(); // 🔍 get current route

    const navItems = [
        { title: "Dashboard", icon: LayoutDashboard, href: "/portal" },
        // { title: "About Us", icon: BadgeHelp, href: "/portal/about" },
        { title: "My Subjects", icon: Users, href: "/portal/subjects" },
        { title: "Attendance Recorder", icon: Microscope, href: "/portal/attendance" },
        { title: "Attendance Analytics", icon: BookOpen, href: "/portal/analytics" },
        { title: "Attendance Calendar", icon: Calendar, href: "/portal/calendar" },
        { title: "Profile Settings", icon: Settings, href: "/portal/profile" },
        { title: "Contact Us", icon: Network, href: "/portal/contact" },
    ];

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu className="flex flex-col gap-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                className={`w-full p-4.5 gap-2 rounded text-sm lg:text-base
                                    ${isActive
                                        ? "bg-[#212178] text-white hover:bg-[#212178] hover:text-white"
                                        : "hover:bg-primary/10 hover:text-primary transition-colors"}`}
                            >
                                <Link href={item.href} className="flex items-center w-full">
                                    <item.icon className="w-6 h-6 lg:w-7 lg:h-7 transition-transform duration-150" />
                                    <span className="truncate ml-2">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
