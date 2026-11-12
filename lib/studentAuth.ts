import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";

/** Resolves the logged-in student from the student_session cookie. */
export async function getStudentContext() {
  await dbConnect();
  const session = (await cookies()).get("student_session")?.value;
  if (!session) return null;
  const student: any = await Student.findOne({ studentId: session }).lean();
  return student || null;
}
