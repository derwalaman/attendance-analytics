"use client";
import SessionLayoutWrapper from "@/components/SessionLayoutWrapper";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import ContactPage from "@/components/webComponents/Contact";

export default function Page() {
    const { data: session, status } = useSession();
    return (
        <SessionLayoutWrapper
            session={session}
        >
            <ContactPage />
        </SessionLayoutWrapper>
    );
}