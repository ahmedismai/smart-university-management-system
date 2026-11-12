import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Mark from "@/models/Mark";
import GradeScale from "@/models/GradeScale";
import Student from "@/models/Student";

const ASSESSMENT_TOTALS: Record<string, number> = { Quiz: 20, Assignment: 20, Midterm: 30, Final: 50 };

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const courseId = searchParams.get("courseId");
    const studentId = searchParams.get("studentId");
    const examType = searchParams.get("examType");

    const query: any = {};
    if (classId) query.classId = classId;
    if (courseId) query.courseId = courseId;
    if (studentId) query.studentId = studentId;
    if (examType) query.examType = examType;

    const marks = await Mark.find(query)
      .populate("studentId", "name studentId")
      .populate("classId", "name code")
      .populate("courseId", "title courseCode")
      .sort({ updatedAt: -1 })
      .limit(500);

    return NextResponse.json(marks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST one mark or an array of marks: { studentId, courseId, examType, obtainedMarks, totalMarks?, remarks? }
// A student has one mark per course and assessment: saving again updates it (no duplicates).
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const rows: any[] = Array.isArray(body) ? body : [body];
    if (!rows.length) return NextResponse.json({ error: "No marks to save" }, { status: 400 });

    const scales: any[] = await GradeScale.find().lean();
    const gradeFor = (pct: number) => scales.find((g) => pct >= g.min && pct <= g.max)?.grade || "F";

    const studentIds = [...new Set(rows.map((r) => String(r.studentId)))];
    const students: any[] = await Student.find({ _id: { $in: studentIds } }).select("classId").lean();

    const ops: any[] = [];
    for (const r of rows) {
      const examType = String(r.examType);
      const total = Number(r.totalMarks) || ASSESSMENT_TOTALS[examType];
      const obtained = Number(r.obtainedMarks);
      if (!ASSESSMENT_TOTALS[examType] || !r.courseId || !r.studentId || !(total > 0) || !Number.isFinite(obtained)) {
        return NextResponse.json({ error: "Each mark needs a student, a course, a valid assessment type and a number" }, { status: 400 });
      }
      if (obtained < 0 || obtained > total) {
        return NextResponse.json({ error: `Marks must be between 0 and ${total}` }, { status: 400 });
      }
      const student = students.find((s) => String(s._id) === String(r.studentId));
      if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
      ops.push({
        updateOne: {
          filter: { studentId: r.studentId, courseId: r.courseId, examType },
          update: {
            $set: {
              classId: r.classId || student.classId,
              obtainedMarks: obtained,
              totalMarks: total,
              grade: gradeFor((obtained / total) * 100),
              remarks: r.remarks || "",
            },
          },
          upsert: true,
        },
      });
    }
    await Mark.bulkWrite(ops);
    return NextResponse.json({ success: true, saved: ops.length }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
