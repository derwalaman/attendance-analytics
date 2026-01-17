"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/* ---------------------------------------------
   Types
--------------------------------------------- */

interface SessionUser {
    id?: string;
    name?: string | null;
    email?: string | null;
}

interface SessionData {
    user?: SessionUser;
}

interface SessionLayoutWrapperProps {
    children: React.ReactNode;
    session: SessionData | null;
}

/* ---------------------------------------------
   Page Title Mapping
--------------------------------------------- */

const pageTitleMap: Record<string, string> = {
    "/portal": "Dashboard",
    "/portal/subjects": "My Subjects",
    "/portal/attendance": "Attendance Recorder",
    "/portal/analytics": "Attendance Analytics",
    "/portal/calendar": "Attendance Calendar",
    // "/portal/about": "About Us",
    "/portal/profile": "Profile Settings",
    "/portal/contact": "Contact Us",
};

/* ---------------------------------------------
   Component
--------------------------------------------- */

export default function SessionLayoutWrapper({
    children,
    session,
}: SessionLayoutWrapperProps) {
    const pathname = usePathname();
    const currentPage = pageTitleMap[pathname] ?? "Dashboard";

    return (
        <SidebarProvider>
            <Toaster richColors position="top-right" closeButton />

            {/* SIDEBAR */}
            <AppSidebar session={session} />

            <SidebarInset className="flex flex-col min-h-screen">

                {/* ================= HEADER ================= */}
                <div className="sticky top-0 z-50 bg-white dark:bg-background">
                    <header className="flex h-20 md:h-24 items-center gap-2">
                        <div className="flex items-center gap-4 px-4 w-full overflow-hidden">
                            <SidebarTrigger className="-ml-1" />

                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4 bg-gray-300"
                            />

                            <div className="flex flex-col truncate w-full leading-tight">
                                <h1 className="font-semibold text-[#212178] dark:text-white truncate sm:text-sm md:text-xl">
                                    Attendance Analytics Portal
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 truncate sm:text-xs md:text-sm lg:text-base">
                                    {session?.user?.name
                                        ? `Welcome, ${session.user.name}`
                                        : "Track • Analyze • Improve"}
                                </p>
                            </div>
                        </div>
                    </header>

                    <div className="h-px w-[99%] bg-gray-300 mx-auto" />

                    {/* ================= BREADCRUMB ================= */}
                    <div className="px-4 p-2">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/portal">
                                        Portal
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbSeparator />

                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-[#212178] dark:text-primary">
                                        {currentPage}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>

                {/* ================= PAGE CONTENT ================= */}
                <main className="flex-1 flex flex-col gap-4 px-4 p-2">
                    {children}
                </main>

                {/* ================= FOOTER ================= */}
                <footer className="mt-auto border-t bg-background/70 backdrop-blur px-6 py-4">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">

                        {/* left */}
                        <p>
                            © {new Date().getFullYear()} Attendance Analytics Portal
                        </p>

                        {/* center */}
                        <p className="hidden md:block">
                            Track • Analyze • Improve
                        </p>

                        {/* right */}
                        <div className="flex gap-4">
                            <a
                                href="/portal/analytics"
                                className="hover:text-primary transition"
                            >
                                Analytics
                            </a>
                            <a
                                href="/portal/contact"
                                className="hover:text-primary transition"
                            >
                                Contact
                            </a>
                            <a
                                href="/portal/profile"
                                className="hover:text-primary transition"
                            >
                                Profile
                            </a>
                        </div>
                    </div>
                </footer>
            </SidebarInset>
        </SidebarProvider>
    );
}
