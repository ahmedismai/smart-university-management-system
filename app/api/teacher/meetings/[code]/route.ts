import { NextResponse } from "next/server";
import { getTeacherContext } from "@/lib/teacherAuth";
import Meeting from "@/models/Meeting";

// Meeting details + my identity inside the room
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const meeting: any = await Meeting.findOne({ code }).lean();
    if (!meeting) return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    if (meeting.hostId !== ctx.teacher.teacherId) return NextResponse.json({ error: "This is not your meeting" }, { status: 403 });
    if (meeting.status !== "live") return NextResponse.json({ error: "This meeting has ended" }, { status: 410 });

    return NextResponse.json({
      success: true,
      meeting: { title: meeting.title, code: meeting.code, hostName: meeting.hostName, startedAt: meeting.startedAt },
      me: { id: ctx.teacher.teacherId, name: ctx.teacher.name, role: "host" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// End the meeting
export async function PATCH(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const meeting = await Meeting.findOneAndUpdate(
      { code, hostId: ctx.teacher.teacherId, status: "live" },
      { status: "ended", endedAt: new Date() },
      { new: true }
    );
    if (!meeting) return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
