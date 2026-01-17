import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";
import Attendance from "@/models/Attendance";

type Mode = "bunk_present" | "bunk_absent" | "bunk_ignore";

export async function GET(req: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const { searchParams } = new URL(req.url);
    const mode = (searchParams.get("mode") as Mode) || "bunk_present";

    const subjects = await Subject.find({ userId }).lean();

    if (!subjects.length) {
        return NextResponse.json({ hasSubjects: false });
    }

    const attendance = await Attendance.find({ userId }).lean();

    /* ================= RAW STATS ================= */

    const stats: Record<
        string,
        {
            present: number;
            absent: number;
            bunk: number;
            cancelled: number;
        }
    > = {};

    type StatusKey = "present" | "absent" | "bunk" | "cancelled";

    attendance.forEach((a: any) => {
        const id = a.subjectId.toString();

        if (!stats[id]) {
            stats[id] = {
                present: 0,
                absent: 0,
                bunk: 0,
                cancelled: 0,
            };
        }

        const status: StatusKey = a.status as StatusKey;
        stats[id][status]++;
    });

    /* ================= OVERALL TOTALS ================= */

    let overallTotalClasses = 0;

    let overallRawPresent = 0;
    let overallRawAbsent = 0;

    let overallCalculatedPresent = 0;
    let overallCalculatedAbsent = 0;

    let totalBunks = 0;

    let bestSubject: string | null = null;
    let worstSubject: string | null = null;

    let bestPerc = -1;
    let worstPerc = 101;

    let danger = false;
    let risk = false;

    /* ================= SUBJECT WISE ================= */

    const subjectWise = subjects.map((sub: any) => {
        const s =
            stats[sub._id.toString()] ?? {
                present: 0,
                absent: 0,
                bunk: 0,
                cancelled: 0,
            };

        /* ---------- RAW ---------- */

        overallRawPresent += s.present;
        overallRawAbsent += s.absent;
        totalBunks += s.bunk;

        /* ---------- CALCULATED ---------- */

        let totalClasses = 0;
        let calculatedPresent = 0;
        let calculatedAbsent = 0;

        if (mode === "bunk_present") {
            totalClasses = s.present + s.absent + s.bunk;
            calculatedPresent = s.present + s.bunk;
            calculatedAbsent = s.absent;
        }

        if (mode === "bunk_absent") {
            totalClasses = s.present + s.absent + s.bunk;
            calculatedPresent = s.present;
            calculatedAbsent = s.absent + s.bunk;
        }

        if (mode === "bunk_ignore") {
            totalClasses = s.present + s.absent;
            calculatedPresent = s.present;
            calculatedAbsent = s.absent;
        }

        overallTotalClasses += totalClasses;
        overallCalculatedPresent += calculatedPresent;
        overallCalculatedAbsent += calculatedAbsent;

        const percentage =
            totalClasses === 0
                ? 100
                : Math.round((calculatedPresent / totalClasses) * 100);

        /* ---------- STATUS ---------- */

        let status: "Safe" | "Risk" | "Danger" = "Safe";

        if (percentage < sub.minAttendance) {
            status = "Danger";
            danger = true;
        } else if (percentage < sub.minAttendance + 5) {
            status = "Risk";
            risk = true;
        }

        if (percentage > bestPerc) {
            bestPerc = percentage;
            bestSubject = sub.subjectName;
        }

        if (percentage < worstPerc) {
            worstPerc = percentage;
            worstSubject = sub.subjectName;
        }

        return {
            subjectId: sub._id,
            subjectName: sub.subjectName,
            subjectCode: sub.subjectCode,

            raw: {
                present: s.present,
                absent: s.absent,
                bunk: s.bunk,
                cancelled: s.cancelled,
            },

            calculated: {
                totalClasses,
                present: calculatedPresent,
                absent: calculatedAbsent,
            },

            percentage,
            status,
        };
    });

    if (bestSubject === worstSubject) worstSubject = null;

    /* ================= OVERALL ================= */

    const overallPercentage =
        overallTotalClasses === 0
            ? 100
            : Math.round(
                (overallCalculatedPresent / overallTotalClasses) * 100
            );

    const overallStatus = danger
        ? "Danger"
        : risk
            ? "Risk"
            : "Safe";

    /* ================= RESPONSE ================= */

    return NextResponse.json({
        hasSubjects: true,

        totalSubjects: subjects.length,

        overall: {
            totalClasses: overallTotalClasses,

            raw: {
                present: overallRawPresent,
                absent: overallRawAbsent,
            },

            calculated: {
                present: overallCalculatedPresent,
                absent: overallCalculatedAbsent,
            },

            percentage: overallPercentage,
            status: overallStatus,
        },

        totalBunks,

        bestSubject,
        worstSubject,

        subjectWise,
    });
}
