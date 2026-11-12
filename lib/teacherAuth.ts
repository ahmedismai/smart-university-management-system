import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Teacher from "@/models/Teacher";
import Routine from "@/models/Routine";
import Section from "@/models/Section";

/** Resolves the logged-in teacher and the section IDs they are allowed to manage. */
export async function getTeacherContext() {
  await dbConnect();
  const session = (await cookies()).get("teacher_session")?.value;
  if (!session) return null;

  const teacher: any = await Teacher.findOne({ teacherId: session }).lean();
  if (!teacher) return null;

  const routines: any[] = await Routine.find({ teacherId: teacher._id }).lean();
  const ownSections: any[] = await Section.find({ teacherId: teacher._id }).lean();
  const sectionIds = [
    ...new Set([...routines.map((r) => String(r.sectionId)), ...ownSections.map((s) => String(s._id))]),
  ];
  return { teacher, sectionIds };
}
