"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PortalLogin from "@/components/PortalLogin";


function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-gray-700">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="text-lg font-medium">Loading, please wait...</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      <Suspense fallback={<Loader />}>
        <PortalLogin />
      </Suspense>
    </main>
  );
}

