import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";

/* ---------------- UPDATE SUBJECT ---------------- */
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // ✅ unwrap params
    const { id } = await params;

    const subject = await Subject.findOneAndUpdate(
        {
            _id: id,
            userId: session.user.id, // 🔐 ownership check
        },
        body,
        { new: true }
    );

    if (!subject) {
        return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json(subject);
}

/* ---------------- DELETE SUBJECT ---------------- */
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ unwrap params
    const { id } = await params;

    const deleted = await Subject.deleteOne({
        _id: id,
        userId: session.user.id,
    });

    if (deleted.deletedCount === 0) {
        return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
