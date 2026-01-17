import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/db";

import Attendance from "@/models/Attendance";
import Subject from "@/models/Subject";

type Mode = "bunk_present" | "bunk_absent" | "bunk_ignore";

export async function GET(req: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const subjectId = searchParams.get("subjectId");
    const mode = (searchParams.get("mode") as Mode) || "bunk_absent";

    if (!subjectId) {
        return NextResponse.json({ error: "subjectId required" }, { status: 400 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const subject = await Subject.findOne({ _id: subjectId, userId });
    if (!subject) {
        return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    const records = await Attendance.find({
        userId,
        subjectId: new mongoose.Types.ObjectId(subjectId),
    }).lean();

    /* ========== RAW COUNTS ========== */

    let present = 0;
    let absent = 0;
    let bunk = 0;
    let cancelled = 0;

    records.forEach((r: any) => {
        if (r.status === "present") present++;
        if (r.status === "absent") absent++;
        if (r.status === "bunk") bunk++;
        if (r.status === "cancelled") cancelled++;
    });

    /* ========== CALCULATION LOGIC ========== */

    let totalClasses = 0;
    let totalPresent = 0;
    let totalAbsent = 0;
    let logicUsed = "";

    if (mode === "bunk_present") {
        totalClasses = present + absent + bunk;
        totalPresent = present + bunk;
        totalAbsent = absent;
        logicUsed =
            "Classes = Present + Absent + Bunk | Present = Present + Bunk";
    }

    if (mode === "bunk_absent") {
        totalClasses = present + absent + bunk;
        totalPresent = present;
        totalAbsent = absent + bunk;
        logicUsed =
            "Classes = Present + Absent + Bunk | Absent = Absent + Bunk";
    }

    if (mode === "bunk_ignore") {
        totalClasses = present + absent;
        totalPresent = present;
        totalAbsent = absent;
        logicUsed = "Classes = Present + Absent | Bunks ignored";
    }

    const attendancePercent =
        totalClasses === 0
            ? 100
            : Math.round((totalPresent / totalClasses) * 100);

    /* ========== STATUS ========== */

    let status: "Safe" | "Risk" | "Danger" = "Safe";

    if (attendancePercent < subject.minAttendance) status = "Danger";
    else if (attendancePercent < subject.minAttendance + 5) status = "Risk";

    return NextResponse.json({
        subjectId,
        subjectName: subject.subjectName,

        raw: {
            present,
            absent,
            bunk,
            cancelled,
        },

        calculated: {
            totalClasses,
            totalPresent,
            totalAbsent,
        },

        attendancePercent,
        status,
        logicUsed,
    });
}
