"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
    BookOpen,
    CheckCircle,
    XCircle,
    Slash,
    Layers,
    TrendingUp,
    AlertTriangle,
    ShieldCheck,
    ShieldAlert,
    ShieldX,
    PlusCircle,
} from "lucide-react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    PieChart as RePieChart,
    Pie,
    Cell,
} from "recharts";

/* ================= TYPES ================= */

type Mode = "bunk_present" | "bunk_absent" | "bunk_ignore";

interface Subject {
    _id: string;
    subjectName: string;
}

interface Analytics {
    subjectId: string;
    subjectName: string;

    raw: {
        present: number;
        absent: number;
        bunk: number;
        cancelled: number;
    };

    calculated: {
        totalClasses: number;
        totalPresent: number;
        totalAbsent: number;
    };

    attendancePercent: number;
    status: "Safe" | "Risk" | "Danger";
    logicUsed: string;
}

/* ================= CONSTANTS ================= */

const MODES = [
    { label: "Bunk = Present", value: "bunk_present" },
    { label: "Bunk = Absent", value: "bunk_absent" },
    { label: "Ignore Bunk", value: "bunk_ignore" },
];

const COLORS = ["#22c55e", "#facc15", "#ef4444", "#60a5fa"];

/* ================= PAGE ================= */

export default function AnalyticsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [subjectId, setSubjectId] = useState("");
    const [mode, setMode] = useState<Mode>("bunk_absent");
    const [data, setData] = useState<Analytics | null>(null);

    useEffect(() => {
        fetch("/api/subjects")
            .then((r) => r.json())
            .then((d) => {
                setSubjects(d);
                if (d.length) setSubjectId(d[0]._id);
            });
    }, []);

    useEffect(() => {
        if (!subjectId) return;

        fetch(
            `/api/attendance/analytics?subjectId=${subjectId}&mode=${mode}`
        )
            .then((r) => r.json())
            .then(setData)
            .catch(() => toast.error("Failed to load analytics"));
    }, [subjectId, mode]);

    const chartData = useMemo(() => {
        if (!data) return [];
        return [
            { name: "Present", value: data.raw.present },
            { name: "Absent", value: data.raw.absent },
            { name: "Bunk", value: data.raw.bunk },
            { name: "Cancelled", value: data.raw.cancelled },
        ];
    }, [data]);

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
    }[data?.status || "Safe"];

    if (!subjects.length) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-6">

                    {/* Icon */}
                    <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                        <BookOpen size={42} className="text-muted-foreground" />
                    </div>

                    {/* Text */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">
                            No Subjects Added
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            You haven’t added any subjects yet.
                            <br />
                            Attendance analytics works only after at least one subject is created.
                        </p>
                    </div>

                    {/* CTA */}
                    <a
                        href="/portal/subjects"
                        className="
                        inline-flex items-center justify-center
                        gap-2 px-8 py-3 rounded-2xl
                        bg-primary text-white font-semibold
                        shadow-lg hover:scale-105 transition
                    "
                    >
                        <PlusCircle size={18} />
                        Add Your First Subject
                    </a>

                    {/* Hint */}
                    <p className="text-xs text-muted-foreground">
                        Once added, analytics will appear automatically.
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="space-y-10 px-4 pb-16">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Attendance Analytics
                    </h1>
                    <p className="text-muted-foreground">
                        Transparent attendance calculation
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <select
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        className="border rounded-xl px-4 py-3"
                    >
                        {subjects.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.subjectName}
                            </option>
                        ))}
                    </select>

                    <div className="flex bg-muted p-1 rounded-xl">
                        {MODES.map((m) => (
                            <button
                                key={m.value}
                                onClick={() => setMode(m.value as Mode)}
                                className={`px-4 py-2 rounded-lg text-sm transition ${mode === m.value
                                    ? "bg-background shadow text-primary font-semibold"
                                    : "text-muted-foreground"
                                    }`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* RAW DATA */}
            <Section title="Actual Attendance">
                <Grid>
                    <Kpi title="Present" value={data?.raw.present} icon={<CheckCircle />} />
                    <Kpi title="Absent" value={data?.raw.absent} icon={<XCircle />} />
                    <Kpi title="Bunk" value={data?.raw.bunk} icon={<Slash />} />
                    <Kpi title="Cancelled" value={data?.raw.cancelled} icon={<Layers />} />
                </Grid>
            </Section>

            {/* CALCULATED */}
            <Section title="Calculated Attendance">
                <Grid>
                    <Kpi title="Total Classes" value={data?.calculated.totalClasses} />
                    <Kpi title="Total Present" value={data?.calculated.totalPresent} />
                    <Kpi title="Total Absent" value={data?.calculated.totalAbsent} />
                    <Kpi
                        title="Attendance %"
                        value={`${data?.attendancePercent}%`}
                        icon={<TrendingUp />}
                    />
                </Grid>
            </Section>

            {/* LOGIC */}
            <div className="rounded-2xl border bg-muted/40 p-5">
                <p className="font-semibold flex items-center gap-2">
                    <AlertTriangle size={18} />
                    Calculation Logic
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    {data?.logicUsed}
                </p>
            </div>

            {/* CHARTS */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Chart title="Attendance Distribution">
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#6366f1" />
                        </BarChart>
                    </ResponsiveContainer>
                </Chart>

                <Chart title="Share">
                    <ResponsiveContainer width="100%" height={260}>
                        <RePieChart>
                            <Pie data={chartData} dataKey="value" outerRadius={90} label>
                                {chartData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </RePieChart>
                    </ResponsiveContainer>
                </Chart>
            </div>

            {/* STATUS */}
            <div
                className={`rounded-2xl p-6 flex items-center gap-4 ${statusUI.bg}`}
            >
                <div className={statusUI.color}>{statusUI.icon}</div>
                <div>
                    <p className="text-sm text-muted-foreground">Attendance Status</p>
                    <p className={`text-xl font-bold ${statusUI.color}`}>
                        {data?.status}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ================= COMPONENTS ================= */

function Section({ title, children }: any) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">{title}</h2>
            {children}
        </div>
    );
}

function Grid({ children }: any) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {children}
        </div>
    );
}

function Kpi({ title, value, icon }: any) {
    return (
        <div className="rounded-2xl border p-5 bg-gradient-to-br from-background to-muted/40">
            <div className="flex justify-between text-muted-foreground">
                <span>{title}</span>
                {icon}
            </div>
            <p className="mt-2 text-2xl font-bold">{value ?? "—"}</p>
        </div>
    );
}

function Chart({ title, children }: any) {
    return (
        <div className="rounded-2xl border p-6">
            <h3 className="font-semibold mb-4">{title}</h3>
            {children}
        </div>
    );
}
