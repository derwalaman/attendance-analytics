import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";

/* ---------------- GET SUBJECTS ---------------- */
export async function GET() {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const subjects = await Subject.find({
        userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(subjects);
}

/* ---------------- ADD SUBJECT ---------------- */
export async function POST(req: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const body = await req.json();
    const { subjectName, subjectCode, minAttendance } = body;

    if (!subjectName?.trim()) {
        return NextResponse.json(
            { error: "Subject name required" },
            { status: 400 }
        );
    }

    const exists = await Subject.findOne({
        userId: session.user.id,
        subjectName: subjectName.trim(),
    });

    if (exists) {
        return NextResponse.json(
            { error: "Subject already exists" },
            { status: 409 }
        );
    }

    const subject = await Subject.create({
        userId: session.user.id,
        subjectName: subjectName.trim(),
        subjectCode: subjectCode?.trim(),
        minAttendance: minAttendance ?? 75,
    });

    return NextResponse.json(subject, { status: 201 });
}
