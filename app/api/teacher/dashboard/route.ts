import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Teacher from "@/models/Teacher";
import Routine from "@/models/Routine";
import Course from "@/models/Course";
import Section from "@/models/Section";
import Class from "@/models/Class";
import Student from "@/models/Student";
import Announcement from "@/models/Announcement";

export async function GET() {
  try {
    await dbConnect();
    const session = (await cookies()).get("teacher_session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    const teacher: any = await Teacher.findOne({ teacherId: session }).lean();
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    // Routines and the teacher's own sections are independent: fetch together
    const [routinesRaw, mainSections]: any[][] = await Promise.all([
      Routine.find({ teacherId: teacher._id }).lean(),
      Section.find({ teacherId: teacher._id }).lean(),
    ]);
    const routines: any[] = routinesRaw;
    const courseIds = [...new Set(routines.map((r: any) => String(r.courseId)))];
    const sectionIds = [
      ...new Set([...routines.map((r: any) => String(r.sectionId)), ...mainSections.map((s: any) => String(s._id))]),
    ];

    // Everything else only depends on the ids above, so run it all in parallel
    const [courses, sections, announcements, students]: any[][] = await Promise.all([
      Course.find({ _id: { $in: courseIds } }).lean(),
      Section.find({ _id: { $in: sectionIds } }).lean(),
      Announcement.find({ status: "Published", targetAudience: { $in: ["All", "Teachers", "Students"] } })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      Student.find({ sectionId: { $in: sectionIds } }).sort({ studentId: 1 }).lean(),
    ]);
    const classes: any[] = await Class.find({ _id: { $in: sections.map((s: any) => s.classId) } }).lean();

    const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const schedule = routines
      .map((r) => {
        const course = courses.find((c: any) => String(c._id) === String(r.courseId));
        const section = sections.find((s: any) => String(s._id) === String(r.sectionId));
        return {
          day: r.day,
          startTime: r.startTime,
          endTime: r.endTime,
          room: r.room,
          type: r.type,
          course: course ? `${course.courseCode} - ${course.title}` : "-",
          section: section?.sectionId || "-",
        };
      })
      .sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.startTime.localeCompare(b.startTime));

    return NextResponse.json({
      teacher: { name: teacher.name, teacherId: teacher.teacherId, email: teacher.email, department: teacher.department },
      stats: {
        courses: courses.length,
        sections: sections.length,
        students: students.length,
        classesPerWeek: routines.length,
      },
      schedule,
      courses: courses.map((c: any) => ({ code: c.courseCode, title: c.title, credits: c.credits, type: c.type })),
      sections: sections.map((s: any) => ({
        id: s.sectionId,
        name: s.name,
        room: s.room,
        program: classes.find((c: any) => String(c._id) === String(s.classId))?.name || "",
        students: students
          .filter((st: any) => String(st.sectionId) === String(s._id))
          .map((st: any) => ({ studentId: st.studentId, name: st.name, email: st.email })),
      })),
      announcements: announcements.map((a: any) => ({ title: a.title, content: a.content, createdAt: a.createdAt })),
    });
  } catch (error: any) {
    console.error("Teacher Dashboard API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
