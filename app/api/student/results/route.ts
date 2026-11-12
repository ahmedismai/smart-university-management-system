import { NextResponse } from "next/server";
import { getStudentContext } from "@/lib/studentAuth";
import { computeStudentResults } from "@/lib/gpa";
import Class from "@/models/Class";

// Real results of the signed-in student (calculated from the marks entered by teachers / admins). No sample data.
export async function GET() {
  try {
    const student: any = await getStudentContext();
    if (!student) return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });

    const classDoc: any = student.classId ? await Class.findById(student.classId).lean() : null;
    const { results, credits, cgpa, hasResults } = await computeStudentResults(student);

    return NextResponse.json({
      success: true,
      student: {
        name: student.name,
        studentId: student.studentId,
        email: student.email,
        department: classDoc?.name || "",
        deptCode: classDoc?.code || "",
      },
      cgpa: cgpa.toFixed(2),
      totalCredits: credits,
      gpaTrend: hasResults ? [cgpa] : [],
      semesters: [
        {
          id: 1,
          name: hasResults ? "Current results" : "No results yet",
          gpa: cgpa.toFixed(2),
          credits,
          status: hasResults ? "Published" : "Pending",
          results,
        },
      ],
    });
  } catch (error: any) {
    console.error("Student Results API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
