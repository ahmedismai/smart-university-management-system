import Routine from "@/models/Routine";

/** Course IDs (as strings) taught to the student's section. */
export async function studentCourseIds(student: any): Promise<string[]> {
  if (!student?.sectionId) return [];
  const routines: any[] = await Routine.find({ sectionId: student.sectionId }).lean();
  return [...new Set(routines.map((r) => String(r.courseId)))];
}
