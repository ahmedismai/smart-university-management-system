import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { emailOrId, password, role } = await request.json();

    if (!emailOrId || !password) {
      return NextResponse.json({ error: "Missing ID/Email or Password" }, { status: 400 });
    }

    if (role === "Admin") {
      // Authenticate admin
      const user = await User.findOne({ email: emailOrId.toLowerCase(), role: "Admin" });
      if (!user) {
        return NextResponse.json({ error: "Invalid Admin Credentials" }, { status: 401 });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid Admin Credentials" }, { status: 401 });
      }

      const response = NextResponse.json({ success: true, redirect: "/admin/dashboard" });
      response.cookies.set("admin_session", emailOrId, { path: "/", maxAge: 86400 });
      return response;
    } else if (role === "Employee") {
      // Authenticate teacher (by teacher ID or email)
      let teacher = await Teacher.findOne({ teacherId: emailOrId.toUpperCase() });
      if (!teacher) {
        teacher = await Teacher.findOne({ email: emailOrId.toLowerCase() });
      }
      if (!teacher) {
        return NextResponse.json({ error: "Invalid Employee ID or Email" }, { status: 401 });
      }

      const user = await User.findOne({ email: teacher.email, role: "Teacher" });
      if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ error: "Invalid Employee ID or Password" }, { status: 401 });
      }

      const response = NextResponse.json({ success: true, redirect: "/teacher/dashboard" });
      response.cookies.set("teacher_session", teacher.teacherId, { path: "/", maxAge: 86400 });
      return response;
    } else {
      // Authenticate student
      let student = await Student.findOne({ studentId: emailOrId.toUpperCase() });
      if (!student) {
        student = await Student.findOne({ email: emailOrId.toLowerCase() });
      }

      if (!student) {
        return NextResponse.json({ error: "Invalid Student ID or Email" }, { status: 401 });
      }

      // Find user by student's email to verify password
      const user = await User.findOne({ email: student.email, role: "Student" });
      if (!user) {
        return NextResponse.json({ error: "No user credentials found for this student" }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid Student ID or Password" }, { status: 401 });
      }

      const response = NextResponse.json({ success: true, redirect: "/student/dashboard" });
      response.cookies.set("student_session", student.studentId, { path: "/", maxAge: 86400 });
      return response;
    }
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
