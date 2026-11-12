import { NextResponse } from "next/server";
import { getTeacherContext } from "@/lib/teacherAuth";
import Announcement from "@/models/Announcement";

// POST { title, content, category? } -> published to students
export async function POST(request: Request) {
  try {
    const ctx = await getTeacherContext();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, content, category } = await request.json();
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }
    const allowed = ["Academic", "Event", "Urgent"];
    const doc = await Announcement.create({
      title: title.trim(),
      content: content.trim(),
      category: allowed.includes(category) ? category : "Academic",
      priority: "Medium",
      targetAudience: "Students",
      status: "Published",
    });
    return NextResponse.json({ success: true, announcement: doc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
