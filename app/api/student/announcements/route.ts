import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Announcement from "@/models/Announcement";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const studentSession = cookieStore.get("student_session")?.value;

    if (!studentSession) {
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    // Retrieve active notices targeted to Students or All
    const announcements = await Announcement.find({
      status: "Published",
      targetAudience: { $in: ["All", "Students"] }
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, announcements });
  } catch (error: any) {
    console.error("Announcements GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
