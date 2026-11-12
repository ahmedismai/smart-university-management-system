import { NextResponse } from "next/server";
import { getStudentContext } from "@/lib/studentAuth";
import { studentCourseIds } from "@/lib/lectureAccess";
import Course from "@/models/Course";
import Teacher from "@/models/Teacher";
import Lecture from "@/models/Lecture";

// Lectures for the courses my section attends
export async function GET() {
  try {
    const student = await getStudentContext();
    if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const courseIds = await studentCourseIds(student);
    const [courses, lectures]: any[] = await Promise.all([
      Course.find({ _id: { $in: courseIds } }).lean(),
      Lecture.find({ courseId: { $in: courseIds } }).select("-data").sort({ createdAt: -1 }).lean(),
    ]);
    const teachers: any[] = await Teacher.find({ _id: { $in: lectures.map((l: any) => l.teacherId) } }).lean();

    return NextResponse.json({
      success: true,
      courses: courses.map((c: any) => ({ id: String(c._id), code: c.courseCode, title: c.title })),
      lectures: lectures.map((l: any) => ({
        id: String(l._id),
        title: l.title,
        description: l.description || "",
        courseId: String(l.courseId),
        teacher: teachers.find((t) => String(t._id) === String(l.teacherId))?.name || "",
        fileName: l.fileName,
        size: l.size,
        createdAt: l.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
