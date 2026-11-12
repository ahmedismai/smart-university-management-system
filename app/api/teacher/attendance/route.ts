import { NextResponse } from "next/server";
import { getTeacherContext } from "@/lib/teacherAuth";
import Section from "@/models/Section";
import Student from "@/models/Student";
import Attendance from "@/models/Attendance";

const STATUSES = ["Present", "Absent", "Late", "Excused"];

// GET /api/teacher/attendance?sectionId=CSE-A&date=2026-11-03
export async function GET(request: Request) {
  try {
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const sectionCode = searchParams.get("sectionId") || "";
    const date = searchParams.get("date") || new Date().toISOString().slice(0, 10);

    const section: any = await Section.findOne({ sectionId: sectionCode }).lean();
    if (!section || !ctx.sectionIds.includes(String(section._id))) {
      return NextResponse.json({ error: "Section not found or not assigned to you" }, { status: 403 });
    }

    const students: any[] = await Student.find({ sectionId: section._id }).sort({ studentId: 1 }).lean();
    const day = new Date(date);
    const records: any[] = await Attendance.find({ studentId: { $in: students.map((s) => s._id) }, date: day }).lean();

    return NextResponse.json({
      date,
      students: students.map((s) => ({
        _id: String(s._id),
        studentId: s.studentId,
        name: s.name,
        status: records.find((r) => String(r.studentId) === String(s._id))?.status || "Present",
        saved: records.some((r) => String(r.studentId) === String(s._id)),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST { sectionId, date, records: [{ _id, status }] }
export async function POST(request: Request) {
  try {
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { sectionId, date, records } = await request.json();
    const section: any = await Section.findOne({ sectionId }).lean();
    if (!section || !ctx.sectionIds.includes(String(section._id))) {
      return NextResponse.json({ error: "Section not found or not assigned to you" }, { status: 403 });
    }
    if (!date || !Array.isArray(records)) {
      return NextResponse.json({ error: "date and records are required" }, { status: 400 });
    }

    const students: any[] = await Student.find({ sectionId: section._id }).lean();
    const byId = new Map(students.map((s) => [String(s._id), s]));
    const day = new Date(date);

    const ops = records
      .filter((r: any) => byId.has(String(r._id)) && STATUSES.includes(r.status))
      .map((r: any) => ({
        updateOne: {
          filter: { studentId: byId.get(String(r._id))._id, date: day },
          update: { $set: { status: r.status, classId: byId.get(String(r._id)).classId } },
          upsert: true,
        },
      }));
    if (ops.length) await Attendance.bulkWrite(ops);

    return NextResponse.json({ success: true, saved: ops.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
