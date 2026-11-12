import { NextResponse } from "next/server";
import { getTeacherContext } from "@/lib/teacherAuth";
import Message from "@/models/Message";

export async function GET(request: Request) {
  try {
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const me: string = ctx.teacher.teacherId;

    const studentId = new URL(request.url).searchParams.get("receiverId");
    if (!studentId) return NextResponse.json({ error: "Missing receiverId parameter" }, { status: 400 });

    const messages = await Message.find({
      $or: [
        { senderId: me, receiverId: studentId },
        { senderId: studentId, receiverId: me },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
