import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const studentSession = cookieStore.get("student_session")?.value;

    if (!studentSession) {
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing current or new password" }, { status: 400 });
    }

    const student = await Student.findOne({ studentId: studentSession });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const user = await User.findOne({ email: student.email, role: "Student" });
    if (!user) {
      return NextResponse.json({ error: "User credentials not found" }, { status: 404 });
    }

    // Check current password match
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }

    // Update with newly hashed password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Settings PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
