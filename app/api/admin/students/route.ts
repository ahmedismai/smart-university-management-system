import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import { getAdminContext } from "@/lib/adminAuth";
import Student from "@/models/Student";
import User from "@/models/User";

const DEFAULT_PASSWORD = "Student@123";
const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const dup = (e: any) =>
  e?.code === 11000
    ? NextResponse.json({ error: "A student with the same email or student ID already exists." }, { status: 409 })
    : NextResponse.json({ error: e.message }, { status: 500 });

export async function GET(request: Request) {
  try {
    if (!(await getAdminContext())) return unauthorized();
    const { searchParams } = new URL(request.url);
    const query: any = {};

    const sectionId = searchParams.get("sectionId");
    const classId = searchParams.get("classId");
    const search = searchParams.get("search");

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (sectionId) query.sectionId = sectionId;
    if (classId) query.classId = classId;

    const students = await Student.find(query).sort({ createdAt: -1 });
    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Creates the student and a login account (default password) so they can sign in.
export async function POST(request: Request) {
  try {
    if (!(await getAdminContext())) return unauthorized();
    await dbConnect();
    const body = await request.json();
    if (!body.classId) delete body.classId;
    if (!body.sectionId) delete body.sectionId;
    const student = await Student.create(body);
    await User.updateOne(
      { email: student.email },
      {
        $setOnInsert: {
          name: student.name,
          email: student.email,
          role: "Student",
          password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
          status: "Active",
        },
      },
      { upsert: true }
    );
    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    return dup(error);
  }
}
