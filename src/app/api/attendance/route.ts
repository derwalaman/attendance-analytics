import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import Subject from "@/models/Subject";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    await connectDB();

    try {
        const userId = session.user.id;

        const attendance = await Attendance.find({ userId })
            .populate("subjectId", "subjectName")
            .sort({ date: -1 });

        const subjects = await Subject.find({ userId });

        const attendanceData = attendance.map((item) => ({
            _id: item._id,
            subjectId: item.subjectId._id,
            subjectName: item.subjectId.subjectName,
            date: item.date.toISOString().slice(0, 10),
            status: item.status,
        }));

        return NextResponse.json({ attendance: attendanceData, subjects });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch attendance" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    await connectDB();
    const userId = session.user.id;

    const { subjectId, date, status } = await req.json();

    if (!subjectId || !date || !status) {
        return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
        );
    }

    try {
        const attendance = new Attendance({
            userId,
            subjectId,
            date,
            status,
        });

        await attendance.save();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Attendance already added for this date" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to add attendance" },
            { status: 500 }
        );
    }
}
