import { NextResponse } from "next/server";
import { getStudentContext } from "@/lib/studentAuth";
import Notification from "@/models/Notification";

// My notifications (latest 20) and the unread count
export async function GET() {
  try {
    const student = await getStudentContext();
    if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const [items, unread]: any[] = await Promise.all([
      Notification.find({ studentId: student._id }).sort({ createdAt: -1 }).limit(20).lean(),
      Notification.countDocuments({ studentId: student._id, read: false }),
    ]);
    return NextResponse.json({
      success: true,
      unread,
      items: items.map((n: any) => ({ id: String(n._id), kind: n.kind, title: n.title, body: n.body, link: n.link, read: n.read, createdAt: n.createdAt })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Mark everything as read
export async function PATCH() {
  try {
    const student = await getStudentContext();
    if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await Notification.updateMany({ studentId: student._id, read: false }, { read: true });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
