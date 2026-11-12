import { NextResponse } from "next/server";
import { getStudentContext } from "@/lib/studentAuth";
import { studentCourseIds } from "@/lib/lectureAccess";
import Course from "@/models/Course";
import Routine from "@/models/Routine";
import Teacher from "@/models/Teacher";
import Lecture from "@/models/Lecture";

const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Course details for a course taught to my section: info, schedule, instructors and lecture files
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const student = await getStudentContext();
    if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const courseIds = await studentCourseIds(student);
    if (!courseIds.includes(id)) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const [course, routines, lectures]: any[] = await Promise.all([
      Course.findById(id).lean(),
      Routine.find({ sectionId: student.sectionId, courseId: id }).lean(),
      Lecture.find({ courseId: id }).select("-data").sort({ createdAt: -1 }).lean(),
    ]);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const teacherIds = [...routines.map((r: any) => r.teacherId), ...lectures.map((l: any) => l.teacherId)];
    const teachers: any[] = await Teacher.find({ _id: { $in: teacherIds } }).lean();
    const teacherName = (tid: any) => teachers.find((t) => String(t._id) === String(tid))?.name || "";

    return NextResponse.json({
      success: true,
      course: {
        id: String(course._id),
        code: course.courseCode,
        title: course.title,
        department: course.department,
        credits: course.credits,
        type: course.type,
        description: course.description || "",
      },
      instructors: [...new Set(routines.map((r: any) => teacherName(r.teacherId)).filter(Boolean))],
      schedule: routines
        .map((r: any) => ({
          day: r.day,
          startTime: r.startTime,
          endTime: r.endTime,
          room: r.room,
          type: r.type,
          teacher: teacherName(r.teacherId),
        }))
        .sort((a: any, b: any) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.startTime.localeCompare(b.startTime)),
      lectures: lectures.map((l: any) => ({
        id: String(l._id),
        title: l.title,
        description: l.description || "",
        teacher: teacherName(l.teacherId),
        fileName: l.fileName,
        size: l.size,
        createdAt: l.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
