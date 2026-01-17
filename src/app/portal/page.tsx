"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";

import {
    BookOpen,
    PlusCircle,
    TrendingUp,
    CheckCircle,
    XCircle,
    Slash,
    ShieldCheck,
    ShieldAlert,
    ShieldX,
} from "lucide-react";

import SessionLayoutWrapper from "@/components/SessionLayoutWrapper";

/* ---------------- TYPES ---------------- */

type Mode = "bunk_present" | "bunk_absent" | "bunk_ignore";

interface DashboardData {
    hasSubjects: boolean;
    totalSubjects: number;

    overall: {
        totalClasses: number;

        raw: {
            present: number;
            absent: number;
        };

        calculated: {
            present: number;
            absent: number;
        };

        percentage: number;
        status: "Safe" | "Risk" | "Danger";
    };

    totalBunks: number;

    bestSubject: string | null;
    worstSubject: string | null;

    subjectWise: any[];
}

/* ---------------- MODE OPTIONS ---------------- */

const modes = [
    {
        label: "Present",
        value: "bunk_present",
        desc: "Bunk counted as present",
    },
    {
        label: "Absent",
        value: "bunk_absent",
        desc: "Bunk counted as absent",
    },
    {
        label: "Ignore",
        value: "bunk_ignore",
        desc: "Bunks ignored fully",
    },
];

/* ================= PAGE ================= */

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [mode, setMode] = useState<Mode>("bunk_present");
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    /* ---------------- AUTH ---------------- */

    useEffect(() => {
        if (status === "unauthenticated") {
            signOut({ callbackUrl: "/" });
        }
    }, [status]);

    /* ---------------- FETCH ---------------- */

    useEffect(() => {
        if (status !== "authenticated") return;

        setLoading(true);

        fetch(`/api/dashboard/overview?mode=${mode}`)
            .then((res) => res.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, [status, mode]);

    if (loading) return <Skeleton />;

    if (!data?.hasSubjects) {
        return (
            <SessionLayoutWrapper session={session}>
                <div className="h-[80vh] flex flex-col items-center justify-center text-center gap-6 px-4">
                    <div className="p-6 rounded-full bg-muted">
                        <BookOpen size={56} />
                    </div>
                    <h2 className="text-3xl font-bold">No Subjects Added</h2>
                    <p className="text-muted-foreground max-w-md">
                        Add subjects to unlock attendance analytics and bunk planning.
                    </p>
                    <button
                        onClick={() => router.push("/portal/subjects")}
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white shadow-lg hover:scale-[1.04] transition"
                    >
                        <PlusCircle size={20} /> Add Subject
                    </button>
                </div>
            </SessionLayoutWrapper>
        );
    }

    const statusUI = {
        Safe: {
            icon: <ShieldCheck />,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        Risk: {
            icon: <ShieldAlert />,
            color: "text-yellow-600",
            bg: "bg-yellow-100",
        },
        Danger: {
            icon: <ShieldX />,
            color: "text-red-600",
            bg: "bg-red-100",
        },
    }[data.overall.status];

    return (
        <SessionLayoutWrapper session={session}>
            <div className="space-y-12 px-4 md:px-0">

                {/* ================= HEADER ================= */}
                <div className="relative overflow-hidden rounded-3xl border bg-background/70 backdrop-blur-xl p-6 md:p-8 space-y-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />

                    <div className="relative">
                        <h1 className="text-4xl font-bold">Attendance Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Smart overview using bunk-aware logic
                        </p>
                    </div>

                    <BunkModeToggle mode={mode} setMode={setMode} />
                </div>

                {/* ================= KPI ================= */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
                    <Kpi title="Subjects" value={data.totalSubjects} icon={<BookOpen />} />

                    <Kpi
                        title="Total Classes"
                        value={data.overall.totalClasses}
                        icon={<TrendingUp />}
                    />

                    <Kpi
                        title="Actual Present"
                        value={data.overall.raw.present}
                        icon={<CheckCircle />}
                    />

                    <Kpi
                        title="Actual Absent"
                        value={data.overall.raw.absent}
                        icon={<XCircle />}
                    />

                    <Kpi
                        title="Calculated Present"
                        value={data.overall.calculated.present}
                        icon={<CheckCircle />}
                    />

                    <Kpi
                        title="Calculated Absent"
                        value={data.overall.calculated.absent}
                        icon={<XCircle />}
                    />

                    <Kpi
                        title="Total Bunks"
                        value={data.totalBunks}
                        icon={<Slash />}
                    />

                    <Kpi
                        title="Attendance %"
                        value={`${data.overall.percentage}%`}
                        icon={<TrendingUp />}
                    />
                </div>

                {/* ================= INSIGHTS ================= */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <OverallStatus status={data.overall.status} />

                    <Insight
                        title="Best Subject"
                        value={data.bestSubject ?? "—"}
                        color="text-green-600"
                    />

                    <Insight
                        title="Needs Attention"
                        value={data.worstSubject ?? "—"}
                        color="text-red-600"
                    />
                </div>

                {/* ================= SUBJECT LIST ================= */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Subject-wise Attendance</h2>

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {data.subjectWise.map((s) => (
                            <div
                                key={s.subjectId}
                                className="rounded-3xl border p-6 bg-background hover:shadow-xl transition space-y-4"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-lg">
                                        {s.subjectName}
                                        {s.subjectCode && (
                                            <span className="text-muted-foreground text-sm">
                                                {" "}({s.subjectCode})
                                            </span>
                                        )}
                                    </h3>
                                    <StatusPill status={s.status} />
                                </div>

                                <div className="space-y-1">
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${s.status === "Safe"
                                                ? "bg-green-500"
                                                : s.status === "Risk"
                                                    ? "bg-yellow-400"
                                                    : "bg-red-500"
                                                }`}
                                            style={{ width: `${s.percentage}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {s.percentage}% attendance
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                                    <p>Total Classes: {s.calculated.totalClasses}</p>
                                    <p>Actual Present: {s.raw.present}</p>
                                    <p>Actual Absent: {s.raw.absent}</p>
                                    <p>Calculated Present: {s.calculated.present}</p>
                                    <p>Calculated Absent: {s.calculated.absent}</p>
                                    <p>Bunk: {s.raw.bunk}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SessionLayoutWrapper>
    );
}

/* ================= COMPONENTS ================= */

const Kpi = ({ title, value, icon }: any) => (
    <div className="rounded-3xl border p-5 bg-gradient-to-br from-background to-muted/40 hover:shadow-lg transition">
        <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-sm">{title}</span>
            <div className="p-2 rounded-xl bg-muted">{icon}</div>
        </div>
        <p className="mt-4 text-2xl font-bold">{value}</p>
    </div>
);

const Insight = ({ title, value, color }: any) => (
    <div className="rounded-3xl border p-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={`text-2xl font-semibold mt-3 ${color}`}>{value}</p>
    </div>
);

const OverallStatus = ({ status }: any) => {
    const map: any = {
        Safe: { icon: <ShieldCheck />, color: "text-green-600" },
        Risk: { icon: <ShieldAlert />, color: "text-yellow-600" },
        Danger: { icon: <ShieldX />, color: "text-red-600" },
    };

    return (
        <div className="rounded-3xl border p-6 flex gap-4 items-center">
            <div className={`p-3 rounded-2xl bg-muted ${map[status].color}`}>
                {map[status].icon}
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Overall Status</p>
                <p className={`text-2xl font-bold ${map[status].color}`}>
                    {status}
                </p>
            </div>
        </div>
    );
};

const StatusPill = ({ status }: any) => (
    <span
        className={`px-4 py-1.5 rounded-full text-xs font-semibold ${status === "Safe"
            ? "bg-green-100 text-green-700"
            : status === "Risk"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
    >
        {status}
    </span>
);

const Skeleton = () => (
    <div className="p-6 md:p-12 animate-pulse grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-3xl" />
        ))}
    </div>
);

/* ================= TOGGLE ================= */

function BunkModeToggle({
    mode,
    setMode,
}: {
    mode: Mode;
    setMode: (m: Mode) => void;
}) {
    return (
        <>
            {/* Desktop */}
            <div className="hidden md:block max-w-xl">
                <div className="relative grid grid-cols-3 rounded-2xl bg-muted p-1">
                    {modes.map((m) => (
                        <button
                            key={m.value}
                            onClick={() => setMode(m.value as Mode)}
                            className={`relative z-10 p-3 rounded-xl transition text-sm ${mode === m.value
                                ? "text-primary font-semibold"
                                : "text-muted-foreground"
                                }`}
                        >
                            <p>{m.label}</p>
                            <p className="text-xs">{m.desc}</p>
                        </button>
                    ))}

                    <div
                        className="absolute inset-y-1 w-1/3 rounded-xl bg-background shadow transition-all duration-300"
                        style={{
                            left:
                                mode === "bunk_present"
                                    ? "0%"
                                    : mode === "bunk_absent"
                                        ? "33.333%"
                                        : "66.666%",
                        }}
                    />
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden grid grid-cols-1 gap-3">
                {modes.map((m) => (
                    <button
                        key={m.value}
                        onClick={() => setMode(m.value as Mode)}
                        className={`p-4 rounded-2xl border text-left transition ${mode === m.value
                            ? "bg-primary text-white"
                            : "bg-background"
                            }`}
                    >
                        <p className="font-semibold">{m.label}</p>
                        <p className="text-xs opacity-80">{m.desc}</p>
                    </button>
                ))}
            </div>
        </>
    );
}
