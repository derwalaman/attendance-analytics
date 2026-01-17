"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
    text?: string;
    fullScreen?: boolean;
}

export default function Loader({
    text = "Loading...",
    fullScreen = false,
}: LoaderProps) {
    const Wrapper = fullScreen ? "div" : React.Fragment;

    return (
        <Wrapper>
            <div
                className={`flex items-center justify-center gap-2 text-gray-500
        ${fullScreen ? "min-h-screen" : "py-20"}`}
            >
                <Loader2 className="animate-spin w-5 h-5" />
                <span className="text-sm font-medium">{text}</span>
            </div>
        </Wrapper>
    );
}
