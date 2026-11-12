import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";

// Who is logged in (used to prefill forms). Never returns anything sensitive.
export async function GET() {
  try {
    await dbConnect();
    const jar = await cookies();
    const studentId = jar.get("student_session")?.value;
    if (studentId) {
      const s: any = await Student.findOne({ studentId }).lean();
      if (s) return NextResponse.json({ role: "Student", name: s.name, email: s.email, id: s.studentId });
    }
    const teacherId = jar.get("teacher_session")?.value;
    if (teacherId) {
      const t: any = await Teacher.findOne({ teacherId }).lean();
      if (t) return NextResponse.json({ role: "Teacher", name: t.name, email: t.email, id: t.teacherId });
    }
    if (jar.get("admin_session")?.value) {
      return NextResponse.json({ role: "Admin", name: "Administrator", email: jar.get("admin_session")!.value, id: "" });
    }
    return NextResponse.json({ role: null });
  } catch {
    return NextResponse.json({ role: null });
  }
}
