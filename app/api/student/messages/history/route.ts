import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Message from "@/models/Message";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const studentSession = cookieStore.get("student_session")?.value;

    if (!studentSession) {
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get("receiverId");

    if (!receiverId) {
      return NextResponse.json({ error: "Missing receiverId parameter" }, { status: 400 });
    }

    // Find messages between the active student and the teacher/receiver
    const messages = await Message.find({
      $or: [
        { senderId: studentSession, receiverId: receiverId },
        { senderId: receiverId, receiverId: studentSession }
      ]
    }).sort({ createdAt: 1 }).lean();

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    console.error("Message History GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
