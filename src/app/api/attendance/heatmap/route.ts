import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";
import Attendance from "@/models/Attendance";
import Subject from "@/models/Subject";

export async function GET(req: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");

    let subjectFilter: any = {};
    if (subjectId && subjectId !== "all") {
        subjectFilter.subjectId = new mongoose.Types.ObjectId(subjectId);
    }

    const attendance = await Attendance.find({
        userId,
        ...subjectFilter,
    })
        .select("date status")
        .lean();

    const calendarMap: Record<
        string,
        {
            date: string;
            status: string;
            count: number;
        }
    > = {};

    attendance.forEach((a: any) => {
        const day = new Date(a.date).toISOString().split("T")[0];

        if (!calendarMap[day]) {
            calendarMap[day] = {
                date: day,
                status: a.status,
                count: 1,
            };
        } else {
            calendarMap[day].count++;
            calendarMap[day].status = a.status;
        }
    });

    return NextResponse.json({
        days: Object.values(calendarMap),
    });
}
