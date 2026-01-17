"use client";
import SessionLayoutWrapper from "@/components/SessionLayoutWrapper";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import AnalyticsPage from "@/components/Attendance/Analytics";

export default function Page() {
    const { data: session, status } = useSession();
    return (
        <SessionLayoutWrapper
            session={session}
        >
            <AnalyticsPage />
        </SessionLayoutWrapper>
    );
}