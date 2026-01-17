"use client";
import SessionLayoutWrapper from "@/components/SessionLayoutWrapper";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import AttendancePage from "@/components/Attendance/main";

export default function Page() {
    const { data: session, status } = useSession();
    return (
        <SessionLayoutWrapper
            session={session}
        >
            <AttendancePage />
        </SessionLayoutWrapper>
    );
}