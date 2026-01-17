"use client";
import SessionLayoutWrapper from "@/components/SessionLayoutWrapper";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import AttendanceHeatmapPage from "@/components/Attendance/Heatmap";

export default function Page() {
    const { data: session, status } = useSession();
    return (
        <SessionLayoutWrapper
            session={session}
        >
            <AttendanceHeatmapPage />
        </SessionLayoutWrapper>
    );
}