import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import Subject from "@/models/Subject";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import PDFDocument from "pdfkit/js/pdfkit.standalone";
import ExcelJS from "exceljs";

export async function GET(req: Request) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const format = searchParams.get("format"); // pdf | excel

    if (!subjectId || !format) {
        return NextResponse.json(
            { error: "subjectId and format required" },
            { status: 400 }
        );
    }

    const subject = await Subject.findById(subjectId);
    const records = await Attendance.find({
        userId: (session.user as any).id,
        subjectId,
    }).sort({ date: 1 });

    if (format === "pdf") {
        const doc = new PDFDocument({
            size: "A4",
            margin: 40,
        });

        const chunks: Buffer[] = [];
        doc.on("data", chunk => chunks.push(chunk));

        // Now safe — no filesystem font loading
        doc.fontSize(18).text("Attendance Report", { align: "center" });
        doc.moveDown();

        doc.fontSize(14).text(`Subject: ${subject.subjectName}`);
        doc.moveDown();

        doc.fontSize(12);
        records.forEach(r => {
            doc.text(
                `${new Date(r.date).toDateString()} — ${r.status.toUpperCase()}`
            );
        });

        doc.end();

        const pdfBuffer = Buffer.concat(chunks);

        return new Response(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=${subject.subjectName}-attendance.pdf`,
            },
        });
    }


    // 📊 EXCEL
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.columns = [
        { header: "Date", key: "date", width: 15 },
        { header: "Status", key: "status", width: 15 },
    ];

    records.forEach(r => {
        sheet.addRow({
            date: new Date(r.date).toLocaleDateString(),
            status: r.status,
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
        headers: {
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename=${subject.subjectName}-attendance.xlsx`,
        },
    });
}
