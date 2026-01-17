import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";

import User from "@/models/User";
import Subject from "@/models/Subject";

/* ================= GET PROFILE ================= */

export async function GET() {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({
        email: session.user.email,
    }).lean() as { _id: mongoose.Types.ObjectId;[key: string]: any } | null;

    if (!user) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        );
    }

    const subjectCount = await Subject.countDocuments({
        userId: user._id,
    });

    /* ---------- COMPLETION LOGIC ---------- */

    let completion = 0;

    if (user.name) completion += 15;
    if (user.email) completion += 15;
    if (user.image) completion += 25;
    if (user.college) completion += 20;
    if (user.semester) completion += 20;
    if (subjectCount > 0) completion += 5;

    return NextResponse.json({
        user,
        completion,
        hasSubjects: subjectCount > 0,
    });
}

/* ================= UPDATE PROFILE ================= */

export async function PUT(req: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const allowedFields = {
        college: body.college,
        semester: body.semester,
    };

    const updated = await User.findOneAndUpdate(
        { email: session.user.email },
        allowedFields,
        { new: true }
    );

    return NextResponse.json(updated);
}
