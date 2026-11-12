import { NextResponse } from "next/server";
import { getTeacherContext } from "@/lib/teacherAuth";
import Meeting from "@/models/Meeting";
import Section from "@/models/Section";

const randomCode = () => {
  const chars = "abcdefghijkmnopqrstuvwxyz";
  const part = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${part(3)}-${part(4)}-${part(3)}`;
};

// List my meetings + the sections I can invite
export async function GET() {
  try {
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const meetings: any[] = await Meeting.find({ hostId: ctx.teacher.teacherId }).sort({ createdAt: -1 }).limit(30).lean();
    const sections: any[] = await Section.find({ _id: { $in: ctx.sectionIds } }).lean();
    const sectionName = new Map(sections.map((s) => [String(s._id), s.name]));

    return NextResponse.json({
      success: true,
      sections: sections.map((s) => ({ id: String(s._id), name: s.name })),
      meetings: meetings.map((m) => ({
        id: String(m._id),
        title: m.title,
        code: m.code,
        status: m.status,
        startedAt: m.startedAt,
        endedAt: m.endedAt,
        sections: (m.sectionIds || []).map((id: any) => sectionName.get(String(id)) || "Section"),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Start a new meeting
export async function POST(request: Request) {
  try {
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const title = String(body.title || "").trim() || `${ctx.teacher.name} - Live Class`;
    const requested: string[] = Array.isArray(body.sectionIds) ? body.sectionIds.map(String) : [];
    // Only sections the teacher actually teaches; default = all of them
    const sectionIds = requested.length ? requested.filter((id) => ctx.sectionIds.includes(id)) : ctx.sectionIds;
    if (!sectionIds.length) return NextResponse.json({ error: "You have no sections to invite" }, { status: 400 });

    let code = randomCode();
    while (await Meeting.exists({ code })) code = randomCode();

    const meeting = await Meeting.create({
      title,
      code,
      hostId: ctx.teacher.teacherId,
      hostName: ctx.teacher.name,
      sectionIds,
    });

    return NextResponse.json({ success: true, code: meeting.code });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
