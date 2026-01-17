import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: Request) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const month = searchParams.get("month"); // YYYY-MM

    // 🛑 VALIDATION
    if (!subjectId || !month) {
        return NextResponse.json(
            { error: "subjectId and month are required" },
            { status: 400 }
        );
    }

    // 📅 MONTH RANGE
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const records = await Attendance.find({
        userId: (session.user as any).id,
        subjectId,
        date: {
            $gte: startDate,
            $lt: endDate,
        },
    });

    return NextResponse.json(records);
}
