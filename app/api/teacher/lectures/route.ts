import { NextResponse } from "next/server";
import { getTeacherContext } from "@/lib/teacherAuth";
import { lectureMimeFromName, MAX_LECTURE_SIZE } from "@/lib/lectureFiles";
import Routine from "@/models/Routine";
import Course from "@/models/Course";
import Lecture from "@/models/Lecture";

async function teacherCourses(teacherId: any) {
  const routines: any[] = await Routine.find({ teacherId }).lean();
  const ids = [...new Set(routines.map((r) => String(r.courseId)))];
  return Course.find({ _id: { $in: ids } }).lean() as Promise<any[]>;
}

// GET -> my courses + my uploaded lectures
export async function GET() {
  try {
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const courses = await teacherCourses(ctx.teacher._id);
    const lectures: any[] = await Lecture.find({ teacherId: ctx.teacher._id }).select("-data").sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      courses: courses.map((c) => ({ id: String(c._id), code: c.courseCode, title: c.title })),
      lectures: lectures.map((l) => ({
        id: String(l._id),
        title: l.title,
        description: l.description || "",
        courseId: String(l.courseId),
        fileName: l.fileName,
        size: l.size,
        createdAt: l.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST multipart/form-data { courseId, title, description?, file }
export async function POST(request: Request) {
  try {
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await request.formData();
    const courseId = String(form.get("courseId") || "");
    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();
    const file = form.get("file");

    if (!title || !courseId) return NextResponse.json({ error: "Course and title are required" }, { status: 400 });
    if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "File is required" }, { status: 400 });
    if (file.size > MAX_LECTURE_SIZE) return NextResponse.json({ error: "File is too large (max 4MB)" }, { status: 400 });

    const mimeType = lectureMimeFromName(file.name);
    if (!mimeType) return NextResponse.json({ error: "Only PDF, DOC and DOCX files are allowed" }, { status: 400 });

    const courses = await teacherCourses(ctx.teacher._id);
    if (!courses.some((c) => String(c._id) === courseId)) {
      return NextResponse.json({ error: "You are not assigned to this course" }, { status: 403 });
    }

    const doc = await Lecture.create({
      title,
      description,
      courseId,
      teacherId: ctx.teacher._id,
      fileName: file.name,
      mimeType,
      size: file.size,
      data: Buffer.from(await file.arrayBuffer()),
    });
    return NextResponse.json({ success: true, id: String(doc._id) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
