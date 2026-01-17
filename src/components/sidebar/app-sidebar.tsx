"use client";

import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { NavBrand } from "@/components/sidebar/nav-brand";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

/* ---------------------------------------------
   Types
--------------------------------------------- */

interface UserSession {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

interface AppSidebarProps
    extends React.ComponentProps<typeof Sidebar> {
    session?: UserSession | null;
}

/* ---------------------------------------------
   Component
--------------------------------------------- */

export function AppSidebar({ session, ...props }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            {/* ---------- Brand / Logo ---------- */}
            <SidebarHeader className="flex h-20 md:h-24 items-center justify-center">
                <NavBrand />
            </SidebarHeader>

            {/* ---------- Divider ---------- */}
            <div className="mx-auto h-px w-[92%] bg-border" />

            {/* ---------- Main Navigation ---------- */}
            <SidebarContent>
                <NavMain />
            </SidebarContent>

            {/* ---------- User Section ---------- */}
            <SidebarFooter className="border-t">
                <NavUser
                    user={{
                        name: session?.user?.name ?? "Guest",
                        email: session?.user?.email ?? "",
                        avatar: session?.user?.image ?? "",
                    }}
                />
            </SidebarFooter>

            {/* ---------- Collapsed Rail ---------- */}
            <SidebarRail />
        </Sidebar>
    );
}
