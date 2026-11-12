import Mark from "@/models/Mark";
import Course from "@/models/Course";
import Class from "@/models/Class";
import GradeScale from "@/models/GradeScale";

export type CourseResult = {
  course: string;
  code: string;
  marks: number; // percentage
  grade: string;
  point: number;
  status: "Pass" | "Fail";
  credits: number;
};

/**
 * Real results of one student, calculated from the marks teachers/admins entered:
 * every course = all its marks added up (quiz + assignment + midterm + final) -> percentage -> grade point (GradeScale).
 * CGPA = credit-weighted average of the course points. Legacy marks saved before courses existed are grouped by program.
 */
export async function computeStudentResults(student: any) {
  const idQuery = { $in: [student._id, String(student._id)] };
  const [marks, scales]: any[] = await Promise.all([Mark.find({ studentId: idQuery }).lean(), GradeScale.find().lean()]);
  const gradeFor = (pct: number) => {
    const g = scales.find((x: any) => pct >= x.min && pct <= x.max);
    return { grade: g?.grade || "F", point: g?.point ?? 0 };
  };

  const groups = new Map<string, { key: string; obtained: number; total: number; kind: "course" | "class" }>();
  for (const m of marks) {
    const kind = m.courseId ? "course" : "class";
    const key = `${kind}:${String(m.courseId || m.classId)}`;
    const g = groups.get(key) || { key: String(m.courseId || m.classId), obtained: 0, total: 0, kind };
    g.obtained += m.obtainedMarks || 0;
    g.total += m.totalMarks || 0;
    groups.set(key, g);
  }

  const courseIds = [...groups.values()].filter((g) => g.kind === "course").map((g) => g.key);
  const classIds = [...groups.values()].filter((g) => g.kind === "class").map((g) => g.key);
  const [courses, classes]: any[] = await Promise.all([
    Course.find({ _id: { $in: courseIds } }).lean(),
    Class.find({ _id: { $in: classIds } }).lean(),
  ]);

  const results: CourseResult[] = [...groups.values()].map((g) => {
    const pct = g.total > 0 ? (g.obtained / g.total) * 100 : 0;
    const gp = gradeFor(pct);
    const c = g.kind === "course" ? courses.find((x: any) => String(x._id) === g.key) : null;
    const cls = g.kind === "class" ? classes.find((x: any) => String(x._id) === g.key) : null;
    return {
      course: c?.title || cls?.name || "Course",
      code: c?.courseCode || cls?.code || "",
      marks: Math.round(pct),
      grade: gp.grade,
      point: gp.point,
      status: gp.point > 0 ? "Pass" : "Fail",
      credits: c?.credits || 3,
    };
  });

  const credits = results.reduce((n, r) => n + r.credits, 0);
  const points = results.reduce((n, r) => n + r.point * r.credits, 0);
  const cgpa = credits > 0 ? Math.round((points / credits) * 100) / 100 : 0;
  return { results, credits, cgpa, hasResults: results.length > 0 };
}
