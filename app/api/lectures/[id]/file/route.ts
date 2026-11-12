import { NextResponse } from "next/server";
import { getTeacherContext } from "@/lib/teacherAuth";
import { getStudentContext } from "@/lib/studentAuth";
import { studentCourseIds } from "@/lib/lectureAccess";
import Lecture from "@/models/Lecture";

// Download a lecture file. Allowed: the teacher who uploaded it, or a student whose section has that course.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const teacher = await getTeacherContext();
    const student = teacher ? null : await getStudentContext();
    if (!teacher && !student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const lecture: any = await Lecture.findById(id).lean().catch(() => null);
    if (!lecture) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const allowed = teacher
      ? String(lecture.teacherId) === String(teacher.teacher._id)
      : (await studentCourseIds(student)).includes(String(lecture.courseId));
    if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const bytes = Buffer.from(lecture.data.buffer ?? lecture.data);
    return new Response(bytes, {
      headers: {
        "Content-Type": lecture.mimeType,
        "Content-Length": String(bytes.length),
        "Content-Disposition": "attachment; filename*=UTF-8''" + encodeURIComponent(lecture.fileName),
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
