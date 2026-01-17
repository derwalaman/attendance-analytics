import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";
import SessionProviderWrapper from "@/components/webComponents/SessionProviderWrapper";

export const metadata: Metadata = {
  title: "Attendance Analytics | NIT Delhi",
  description: "Smart attendance analytics dashboard",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors position="top-right" closeButton />
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
