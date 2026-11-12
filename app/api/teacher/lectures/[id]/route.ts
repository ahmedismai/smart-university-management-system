import { NextResponse } from "next/server";
import { getTeacherContext } from "@/lib/teacherAuth";
import Lecture from "@/models/Lecture";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const res = await Lecture.deleteOne({ _id: id, teacherId: ctx.teacher._id });
    if (!res.deletedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
