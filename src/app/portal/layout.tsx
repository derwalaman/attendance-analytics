"use client";

import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DepartmentPortalLayoutProps {
    children: React.ReactNode;
}

export default function DepartmentPortalLayout({
    children,
}: DepartmentPortalLayoutProps) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            signOut({ redirect: false });
            router.push("/?error=unauthenticated");
        }
    }, [status, router]);

    // Optional: prevent flicker while checking session
    if (status === "loading") {
        return null; // or loader
    }

    return <>{children}</>;
}
