import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Class from "@/models/Class";
import Section from "@/models/Section";
import Attendance from "@/models/Attendance";
import Fee from "@/models/Fee";
import Fine from "@/models/Fine";
import FeeHead from "@/models/FeeHead";
import Routine from "@/models/Routine";
import Course from "@/models/Course";
import Teacher from "@/models/Teacher";
import Announcement from "@/models/Announcement";
import BookIssue from "@/models/BookIssue";
import Lecture from "@/models/Lecture";

export type StudentFacts = {
  name: string;
  studentId: string;
  program: string;
  section: string;
  attendance: { present: number; late: number; absent: number; excused: number; total: number; percent: number | null };
  feesDue: { total: number; items: { name: string; amount: number; due: string }[] };
  fines: { total: number; items: { type: string; amount: number }[] };
  schedule: { day: string; time: string; course: string; room: string; type: string; teacher: string }[];
  courses: string[];
  books: { title: string; due: string; status: string }[];
  announcements: { title: string; date: string }[];
  recentLectures: { title: string; course: string }[];
};

const fmt = (d: any) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Real data of the logged-in student only (nothing invented). Returns null when nobody is signed in as a student. */
export async function getStudentFacts(): Promise<StudentFacts | null> {
  await dbConnect();
  const id = (await cookies()).get("student_session")?.value;
  if (!id) return null;
  const student: any = await Student.findOne({ studentId: id }).lean();
  if (!student) return null;

  const idQuery = { $in: [student._id, String(student._id)] };
  const [cls, section, att, fees, fines, routines, issues, announcements]: any[] = await Promise.all([
    student.classId ? Class.findById(student.classId).lean() : null,
    student.sectionId ? Section.findById(student.sectionId).lean() : null,
    Attendance.find({ studentId: idQuery }).select("status").lean(),
    Fee.find({ studentId: idQuery, status: { $in: ["Pending", "Failed", "Unpaid"] } }).sort({ dueDate: 1 }).lean(),
    Fine.find({ studentId: idQuery, status: "Unpaid" }).lean(),
    student.sectionId ? Routine.find({ sectionId: student.sectionId }).lean() : [],
    BookIssue.find({ memberId: { $in: [student.studentId, String(student._id)] }, status: { $in: ["Active", "Overdue"] } }).populate("book", "title").lean(),
    Announcement.find({ status: "Published", targetAudience: { $in: ["All", "Students"] } }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const count = (s: string) => att.filter((a: any) => a.status === s).length;
  const present = count("Present"), late = count("Late"), absent = count("Absent"), excused = count("Excused");
  const total = att.length;

  const heads: any[] = await FeeHead.find({ _id: { $in: fees.map((f: any) => f.feeHeadId).filter(Boolean) } }).lean();
  const courseIds = [...new Set(routines.map((r: any) => String(r.courseId)))];
  const [courses, teachers, lectures]: any[] = await Promise.all([
    Course.find({ _id: { $in: courseIds } }).lean(),
    Teacher.find({ _id: { $in: routines.map((r: any) => r.teacherId) } }).lean(),
    Lecture.find({ courseId: { $in: courseIds } }).select("title courseId").sort({ createdAt: -1 }).limit(8).lean(),
  ]);
  const courseName = (cid: any) => {
    const c = courses.find((x: any) => String(x._id) === String(cid));
    return c ? `${c.courseCode} ${c.title}` : "";
  };

  return {
    name: student.name,
    studentId: student.studentId,
    program: cls ? `${cls.code} - ${cls.name}` : "",
    section: section?.name || section?.sectionId || "",
    attendance: {
      present, late, absent, excused, total,
      percent: total ? Math.round((present / total) * 100) : null,
    },
    feesDue: {
      total: fees.reduce((n: number, f: any) => n + (f.amount || 0), 0),
      items: fees.slice(0, 6).map((f: any) => ({
        name: heads.find((h) => String(h._id) === String(f.feeHeadId))?.name || "Fee",
        amount: f.amount,
        due: fmt(f.dueDate),
      })),
    },
    fines: {
      total: fines.reduce((n: number, f: any) => n + (f.amount || 0), 0),
      items: fines.slice(0, 6).map((f: any) => ({ type: f.type || "Fine", amount: f.amount })),
    },
    schedule: routines
      .map((r: any) => ({
        day: r.day,
        time: `${r.startTime}-${r.endTime}`,
        course: courseName(r.courseId),
        room: r.room,
        type: r.type,
        teacher: teachers.find((t: any) => String(t._id) === String(r.teacherId))?.name || "",
      }))
      .sort((a: any, b: any) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.time.localeCompare(b.time)),
    courses: courses.map((c: any) => `${c.courseCode} ${c.title}`),
    books: issues.map((i: any) => ({ title: i.book?.title || "Book", due: fmt(i.dueDate), status: i.status })),
    announcements: announcements.map((a: any) => ({ title: a.title, date: fmt(a.createdAt) })),
    recentLectures: lectures.map((l: any) => ({ title: l.title, course: courseName(l.courseId) })),
  };
}

/** Plain-text rendering used inside the model prompt. */
export function factsToText(f: StudentFacts): string {
  const a = f.attendance;
  const lines = [
    `Student: ${f.name} (ID ${f.studentId}), program: ${f.program || "n/a"}, section: ${f.section || "n/a"}`,
    a.total
      ? `Attendance: ${a.percent}% (${a.present} present, ${a.late} late, ${a.absent} absent, ${a.excused} excused out of ${a.total} recorded days; the percentage counts present days only, like the portal)`
      : "Attendance: no records yet",
    f.feesDue.items.length
      ? `Fees due: total ${f.feesDue.total} EGP - ` + f.feesDue.items.map((i) => `${i.name} ${i.amount} (due ${i.due})`).join("; ")
      : "Fees due: none",
    f.fines.items.length ? `Unpaid fines: total ${f.fines.total} EGP - ` + f.fines.items.map((i) => `${i.type} ${i.amount}`).join("; ") : "Unpaid fines: none",
    f.courses.length ? `Courses: ${f.courses.join("; ")}` : "Courses: none assigned yet",
    f.schedule.length ? "Weekly schedule:\n" + f.schedule.map((s) => `- ${s.day} ${s.time} ${s.course} (${s.type}, ${s.room}, ${s.teacher})`).join("\n") : "Weekly schedule: none",
    f.books.length ? "Borrowed books: " + f.books.map((b) => `${b.title} (due ${b.due}, ${b.status})`).join("; ") : "Borrowed books: none",
    f.announcements.length ? "Latest announcements: " + f.announcements.map((x) => `${x.title} (${x.date})`).join("; ") : "Latest announcements: none",
    f.recentLectures.length ? "Recent lecture files: " + f.recentLectures.map((l) => `${l.title} [${l.course}]`).join("; ") : "Recent lecture files: none",
  ];
  return lines.join("\n");
}
