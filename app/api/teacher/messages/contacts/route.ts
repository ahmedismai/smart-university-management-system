import { NextResponse } from "next/server";
import { getTeacherContext } from "@/lib/teacherAuth";
import Student from "@/models/Student";
import Message from "@/models/Message";

// Contacts = students in my sections + anyone who has exchanged messages with me
export async function GET() {
  try {
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const me: string = ctx.teacher.teacherId;

    const messages: any[] = await Message.find({ $or: [{ senderId: me }, { receiverId: me }] })
      .sort({ createdAt: -1 })
      .lean();

    const lastByPartner = new Map<string, any>();
    const unreadByPartner = new Map<string, number>();
    for (const m of messages) {
      const partner = m.senderId === me ? m.receiverId : m.senderId;
      if (!lastByPartner.has(partner)) lastByPartner.set(partner, m);
    }

    const sectionStudents: any[] = await Student.find({ sectionId: { $in: ctx.sectionIds } }).lean();
    const extraIds = [...lastByPartner.keys()].filter((id) => !sectionStudents.some((s) => s.studentId === id));
    const extraStudents: any[] = extraIds.length ? await Student.find({ studentId: { $in: extraIds } }).lean() : [];

    const contacts = [...sectionStudents, ...extraStudents].map((s) => {
      const last = lastByPartner.get(s.studentId);
      return {
        id: s.studentId,
        name: s.name,
        role: "Student",
        lastMsg: last ? last.text : "No messages yet.",
        time: last ? last.createdAt : null,
        unread: unreadByPartner.get(s.studentId) || 0,
      };
    });

    // Conversations first (newest on top), then the rest alphabetically
    contacts.sort((a, b) => {
      if (a.time && b.time) return new Date(b.time).getTime() - new Date(a.time).getTime();
      if (a.time) return -1;
      if (b.time) return 1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({ success: true, me: { id: me, name: ctx.teacher.name }, contacts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
