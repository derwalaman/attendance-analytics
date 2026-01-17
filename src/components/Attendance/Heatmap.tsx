"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    CalendarDays,
} from "lucide-react";

import { BookOpen, PlusCircle } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner";

/* ================= TYPES ================= */

interface HeatmapDay {
    date: string;
    status: string;
}

interface Subject {
    _id: string;
    subjectName: string;
}

/* ================= STYLES ================= */

const STATUS_COLORS: Record<string, string> = {
    present: "bg-green-500 text-white",
    absent: "bg-red-500 text-white",
    bunk: "bg-yellow-400 text-black",
    cancelled: "bg-blue-500 text-white",
    no_class: "bg-muted text-muted-foreground",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ================= PAGE ================= */

export default function AttendanceCalendarPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [subjectId, setSubjectId] = useState("");
    const [loading, setLoading] = useState(true);

    const [attendance, setAttendance] = useState<HeatmapDay[]>([]);
    const [month, setMonth] = useState(new Date());

    /* ---------------- FETCH SUBJECTS ---------------- */

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                setLoading(true);

                const res = await fetch("/api/subjects");
                const data = await res.json();

                setSubjects(data);

                if (data.length > 0) {
                    setSubjectId(data[0]._id);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                toast.error("Failed to load subjects");
                setLoading(false);
            }
        };

        loadSubjects();
    }, []);

    /* ---------------- FETCH ATTENDANCE ---------------- */

    useEffect(() => {
        if (!subjectId) return;

        const loadAttendance = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `/api/attendance/heatmap?subjectId=${subjectId}`
                );

                const d = await res.json();

                setAttendance(d.days || []);
            } catch (error) {
                toast.error("Failed to load attendance data");
            } finally {
                setLoading(false);
            }
        };

        loadAttendance();
    }, [subjectId]);

    /* ---------------- MAP ---------------- */

    const attendanceMap = useMemo(() => {
        const map: Record<string, string> = {};
        attendance.forEach((d) => (map[d.date] = d.status));
        return map;
    }, [attendance]);

    /* ---------------- CALENDAR LOGIC ---------------- */

    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate(); // leap year handled

    const calendar: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) calendar.push(null);
    for (let d = 1; d <= daysInMonth; d++)
        calendar.push(new Date(year, monthIndex, d));

    const todayISO = new Date().toISOString().split("T")[0];

    if (loading) {
        return <Loader />;
    }

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
                            Attendance Calendar works only after at least one subject is created.
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
                        Once added, calendar will appear automatically.
                    </p>
                </div>
            </div>
        );
    }

    /* ================= UI ================= */

    return (
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-8">

            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                        <CalendarDays className="w-6 h-6 sm:w-7 sm:h-7" />
                        Attendance Calendar
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Monthly attendance overview
                    </p>
                </div>

                <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="
            w-full sm:w-auto
            px-4 py-3 rounded-xl border
            bg-background shadow-sm
          "
                >
                    {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                            {s.subjectName}
                        </option>
                    ))}
                </select>
            </div>

            {/* MONTH NAV */}
            <div className="
        flex items-center justify-between
        rounded-2xl border bg-background/70
        px-4 py-3
      ">
                <button
                    onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}
                    className="p-2 rounded-lg hover:bg-muted"
                >
                    <ChevronLeft />
                </button>

                <h2 className="text-lg sm:text-xl font-semibold">
                    {month.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                    })}
                </h2>

                <button
                    onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}
                    className="p-2 rounded-lg hover:bg-muted"
                >
                    <ChevronRight />
                </button>
            </div>

            {/* WEEKDAYS */}
            <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium text-muted-foreground">
                {WEEKDAYS.map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* CALENDAR GRID */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
                {calendar.map((date, i) => {
                    if (!date) return <div key={i} />;

                    const iso = date.toISOString().split("T")[0];
                    const status = attendanceMap[iso] || "no_class";

                    return (
                        <div
                            key={iso}
                            className={`
                aspect-square rounded-xl
                flex items-center justify-center
                text-sm sm:text-base font-semibold
                transition hover:scale-105
                ${STATUS_COLORS[status]}
                ${iso === todayISO ? "ring-2 ring-primary" : ""}
              `}
                        >
                            {date.getDate()}
                        </div>
                    );
                })}
            </div>

            {/* LEGEND */}
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm pt-2">
                <Legend color="bg-green-500" label="Present" />
                <Legend color="bg-red-500" label="Absent" />
                <Legend color="bg-yellow-400" label="Bunk" />
                <Legend color="bg-blue-500" label="Cancelled" />
                <Legend color="bg-muted" label="No class" />
            </div>
        </div>
    );
}

/* ================= LEGEND ================= */

function Legend({ color, label }: any) {
    return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border bg-background">
            <span className={`w-3 h-3 rounded ${color}`} />
            <span>{label}</span>
        </div>
    );
}
