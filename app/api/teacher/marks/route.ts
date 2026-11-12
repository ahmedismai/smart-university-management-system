import { NextResponse } from "next/server";
import { getTeacherContext } from "@/lib/teacherAuth";
import Section from "@/models/Section";
import Student from "@/models/Student";
import Mark from "@/models/Mark";
import GradeScale from "@/models/GradeScale";
import Course from "@/models/Course";
import Routine from "@/models/Routine";

/** The course (by code) this teacher teaches to that section, or null. */
async function teachingCourse(ctx: any, section: any, courseCode: string) {
  if (!courseCode) return null;
  const course: any = await Course.findOne({ courseCode }).lean();
  if (!course) return null;
  const taught = await Routine.exists({ teacherId: ctx.teacher._id, sectionId: section._id, courseId: course._id });
  return taught ? course : null;
}

const EXAM_TYPES = ["Quiz", "Assignment", "Midterm", "Final"];

async function gradeFor(percentage: number) {
  const scales: any[] = await GradeScale.find().lean();
  return scales.find((g) => percentage >= g.min && percentage <= g.max)?.grade || "F";
}

// GET /api/teacher/marks?sectionId=CSE-A&examType=Midterm
export async function GET(request: Request) {
  try {
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const sectionCode = searchParams.get("sectionId") || "";
    const examType = searchParams.get("examType") || "Midterm";
    const courseCode = searchParams.get("courseCode") || "";

    const section: any = await Section.findOne({ sectionId: sectionCode }).lean();
    if (!section || !ctx.sectionIds.includes(String(section._id))) {
      return NextResponse.json({ error: "Section not found or not assigned to you" }, { status: 403 });
    }

    const course = await teachingCourse(ctx, section, courseCode);
    if (!course) return NextResponse.json({ error: "Choose a course you teach in this section" }, { status: 400 });

    const students: any[] = await Student.find({ sectionId: section._id }).sort({ studentId: 1 }).lean();
    const marks: any[] = await Mark.find({ studentId: { $in: students.map((s) => s._id) }, examType, courseId: course._id }).lean();

    return NextResponse.json({
      examType,
      students: students.map((s) => {
        const m = marks.find((x) => String(x.studentId) === String(s._id));
        return {
          _id: String(s._id),
          studentId: s.studentId,
          name: s.name,
          obtainedMarks: m?.obtainedMarks ?? null,
          totalMarks: m?.totalMarks ?? null,
          grade: m?.grade || "",
        };
      }),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST { sectionId, examType, totalMarks, records: [{ _id, obtainedMarks }] }
export async function POST(request: Request) {
  try {
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { sectionId, courseCode, examType, totalMarks, records } = await request.json();
    const total = Number(totalMarks);
    if (!EXAM_TYPES.includes(examType) || !(total > 0) || !Array.isArray(records)) {
      return NextResponse.json({ error: "Valid examType, totalMarks and records are required" }, { status: 400 });
    }

    const section: any = await Section.findOne({ sectionId }).lean();
    if (!section || !ctx.sectionIds.includes(String(section._id))) {
      return NextResponse.json({ error: "Section not found or not assigned to you" }, { status: 403 });
    }

    const course = await teachingCourse(ctx, section, courseCode);
    if (!course) return NextResponse.json({ error: "Choose a course you teach in this section" }, { status: 400 });

    const students: any[] = await Student.find({ sectionId: section._id }).lean();
    const byId = new Map(students.map((s) => [String(s._id), s]));

    const ops = [];
    for (const r of records) {
      const student = byId.get(String(r._id));
      const obtained = Number(r.obtainedMarks);
      if (!student || r.obtainedMarks === "" || r.obtainedMarks === null || Number.isNaN(obtained)) continue;
      if (obtained < 0 || obtained > total) {
        return NextResponse.json({ error: `Marks for ${student.studentId} must be between 0 and ${total}` }, { status: 400 });
      }
      ops.push({
        updateOne: {
          filter: { studentId: student._id, classId: student.classId, courseId: course._id, examType },
          update: { $set: { obtainedMarks: obtained, totalMarks: total, grade: await gradeFor((obtained / total) * 100) } },
          upsert: true,
        },
      });
    }
    if (ops.length) await Mark.bulkWrite(ops);

    return NextResponse.json({ success: true, saved: ops.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
