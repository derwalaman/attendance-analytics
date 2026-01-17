import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { authOptions } from "@/lib/auth-options";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = session.user.id;

    const { id } = await params; // ✅ FIX

    const { subjectId, date, status } = await req.json();

    if (!subjectId || !date || !status) {
        return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
        );
    }

    try {
        const updated = await Attendance.findOneAndUpdate(
            { _id: id, userId },
            { subjectId, date, status },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { error: "Attendance not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Attendance already exists for this date" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to update attendance" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = session.user.id;

    const { id } = await params; // ✅ FIX

    try {
        const deleted = await Attendance.findOneAndDelete({ _id: id, userId });

        if (!deleted) {
            return NextResponse.json(
                { error: "Attendance not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete attendance" },
            { status: 500 }
        );
    }
}