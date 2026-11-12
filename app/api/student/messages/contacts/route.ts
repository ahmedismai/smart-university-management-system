import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const studentSession = cookieStore.get("student_session")?.value;

    if (!studentSession) {
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    const student = await Student.findOne({ studentId: studentSession }).lean();
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Find active teachers
    const teachers = await Teacher.find({ status: "Active" }).lean();
    
    const contacts = teachers.map(t => ({
      id: t.teacherId,
      name: t.name,
      role: "Professor",
      status: "online", // simulate online status
      lastMsg: "Select chat to view history.",
      time: "Just now",
      unread: 0,
      image: t.name.split(" ").filter(Boolean).map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    }));

    return NextResponse.json({ success: true, contacts });
  } catch (error: any) {
    console.error("Contacts GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
