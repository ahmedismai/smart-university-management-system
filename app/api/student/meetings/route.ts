import { NextResponse } from "next/server";
import { getStudentContext } from "@/lib/studentAuth";
import Meeting from "@/models/Meeting";

// Meetings my section is invited to (live first, then recent)
export async function GET() {
  try {
    const student = await getStudentContext();
    if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!student.sectionId) return NextResponse.json({ success: true, meetings: [] });

    const meetings: any[] = await Meeting.find({ sectionIds: student.sectionId }).sort({ createdAt: -1 }).limit(20).lean();
    return NextResponse.json({
      success: true,
      meetings: meetings.map((m) => ({
        id: String(m._id),
        title: m.title,
        code: m.code,
        hostName: m.hostName,
        status: m.status,
        startedAt: m.startedAt,
        endedAt: m.endedAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
