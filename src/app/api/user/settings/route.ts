import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById((session.user as any).id);

    return NextResponse.json({
        attendanceMode: user.attendanceMode,
    });
}

export async function POST(req: Request) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attendanceMode } = await req.json();

    await User.findByIdAndUpdate((session.user as any).id, {
        attendanceMode,
    });

    return NextResponse.json({ success: true });
}
