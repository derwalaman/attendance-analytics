import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(){
    await connectDB();
    const session = await getServerSession(authOptions);

    console.log("SERVER SESSION:", session);

    if(!session?.user){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    console.log("USER ID:", userId);

    const subjects = await Subject.find({
        userId: userId,
    });

    return NextResponse.json(subjects);
}

export async function POST(req: Request){
    await connectDB();
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const subject = await Subject.create({
        userId: (session.user as any).id,
        subjectName: body.subjectName,
        subjectCode: body.subjectCode,
        minAttendance: body.minAttendance || 75,
    });

    return NextResponse.json(subject);

}