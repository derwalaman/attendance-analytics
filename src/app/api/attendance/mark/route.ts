import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subjectId, date, status } = await req.json();

    if (!subjectId || !date || !status) {
        return NextResponse.json(
            { error: "Missing fields" },
            { status: 400 }
        );
    }

    await Attendance.findOneAndUpdate(
        {
            userId: (session.user as any).id,
            subjectId,
            date: new Date(date), // ✅ convert string → Date
        },
        {
            status,
        },
        {
            upsert: true,
            new: true,
        }
    );

    return NextResponse.json({ success: true });
}
