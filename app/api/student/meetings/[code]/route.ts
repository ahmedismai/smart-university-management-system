import { NextResponse } from "next/server";
import { getStudentContext } from "@/lib/studentAuth";
import Meeting from "@/models/Meeting";

// Check that I can join this meeting and return my identity inside the room
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const student = await getStudentContext();
    if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const meeting: any = await Meeting.findOne({ code: code.trim().toLowerCase() }).lean();
    if (!meeting) return NextResponse.json({ error: "Meeting not found. Check the code." }, { status: 404 });
    if (meeting.status !== "live") return NextResponse.json({ error: "This meeting has ended" }, { status: 410 });

    const invited = (meeting.sectionIds || []).some((id: any) => String(id) === String(student.sectionId));
    if (!invited) return NextResponse.json({ error: "You are not invited to this meeting" }, { status: 403 });

    return NextResponse.json({
      success: true,
      meeting: { title: meeting.title, code: meeting.code, hostName: meeting.hostName, startedAt: meeting.startedAt },
      me: { id: student.studentId, name: student.name, role: "participant" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
