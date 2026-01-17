"use client";

import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function PortalLogin() {
    const { status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/portal");
        }
    }, [status, router]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        await signIn("google", { callbackUrl: "/portal" });
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">

            {/* ================= BACKGROUND ================= */}
            <Image
                src="/admin.png"
                alt="Background"
                fill
                priority
                className="object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0C2945]/95 via-[#0C2945]/85 to-black/90" />

            {/* Floating glow */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-500/20 blur-[160px]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[160px]" />

            {/* ================= MAIN ================= */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4">

                <div className="w-full max-w-6xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)]">

                    {/* ================= LEFT LOGIN ================= */}
                    <div className="relative bg-white/95 backdrop-blur-xl p-10 flex flex-col justify-center">

                        {/* diagonal shape */}
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-gray-200/60 to-transparent"
                            style={{
                                clipPath:
                                    "polygon(0 0, 60% 0, 100% 50%, 60% 100%, 0 100%)",
                            }}
                        />

                        <div className="relative z-10 flex flex-col items-center text-center gap-7">

                            <h1 className="text-3xl font-bold text-[#0C2945]">
                                Portal Login
                            </h1>

                            <p className="text-sm text-gray-500">
                                Sign in using your organization account
                            </p>

                            <Image
                                src="/userLock.png"
                                alt="login"
                                width={90}
                                height={90}
                                priority
                            />

                            {/* ================= BUTTON ================= */}
                            <button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="
                  w-full max-w-xs
                  flex items-center justify-center gap-3
                  rounded-full
                  border border-gray-300
                  bg-white
                  px-6 py-3
                  text-sm font-medium
                  text-gray-700
                  shadow-sm
                  hover:shadow-lg
                  hover:scale-[1.02]
                  transition-all
                  disabled:opacity-60
                "
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <Image
                                            src="/google.svg"
                                            alt="google"
                                            width={20}
                                            height={20}
                                        />
                                        Continue with Google
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-400 max-w-xs">
                                By continuing, you agree to our terms and privacy policy.
                            </p>
                        </div>
                    </div>

                    {/* ================= RIGHT INFO ================= */}
                    <div className="hidden md:flex relative items-center justify-center p-14 text-white">

                        <div className="max-w-md text-center space-y-6">

                            <div className="mx-auto w-24 h-24">
                                {/* keep your SVG logo here */}
                                <Image
                                    src="/logo.svg"
                                    alt="logo"
                                    width={96}
                                    height={96}
                                />
                            </div>

                            <h2 className="text-3xl font-bold">
                                Attendance Analytics Portal
                            </h2>

                            <p className="text-white/80 leading-relaxed text-sm">
                                Monitor attendance, analyze trends, identify risks and
                                generate reports — all from a single intelligent dashboard.
                            </p>

                            <div className="grid grid-cols-3 gap-4 pt-6 text-xs text-white/80">
                                <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                                    Smart Analytics
                                </div>
                                <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                                    Attendance Recorder
                                </div>
                                <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                                    Subject Insights
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
