import { NextResponse } from "next/server";
import { getStudentContext } from "@/lib/studentAuth";
import { computeStudentResults } from "@/lib/gpa";
import Attendance from "@/models/Attendance";
import Fee from "@/models/Fee";
import Fine from "@/models/Fine";
import Notification from "@/models/Notification";
import Announcement from "@/models/Announcement";
import Message from "@/models/Message";
import Routine from "@/models/Routine";
import Course from "@/models/Course";
import Teacher from "@/models/Teacher";
import Exam from "@/models/Exam";
import Mark from "@/models/Mark";

const COLORS = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-pink-500", "bg-amber-500"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ASSESSMENTS = ["Quiz", "Assignment", "Midterm", "Final"];

const dateLabel = (d: any) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Just now");

/** Days from now until the next time this weekly class happens (0 = today). */
function daysUntil(day: string) {
  const idx = DAYS.indexOf(day);
  return idx < 0 ? 99 : (idx - new Date().getDay() + 7) % 7;
}

// Everything on this dashboard comes from the signed-in student's own records. No sample data.
export async function GET() {
  try {
    const student: any = await getStudentContext();
    if (!student) return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });

    const idQuery = { $in: [student._id, String(student._id)] };
    const weekAgo = new Date(Date.now() - 7 * 86400000);

    const [attendance, fees, fines, notifications, announcements, messagesWeek, routines, results]: any[] = await Promise.all([
      Attendance.find({ studentId: idQuery }).select("status date").lean(),
      Fee.find({ studentId: idQuery, status: { $in: ["Pending", "Failed", "Unpaid"] } }).lean(),
      Fine.find({ studentId: idQuery, status: "Unpaid" }).lean(),
      Notification.find({ studentId: student._id }).sort({ createdAt: -1 }).limit(5).lean(),
      Announcement.find({ status: "Published", targetAudience: { $in: ["All", "Students"] }, $or: [{ category: "Urgent" }, { priority: "High" }] })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      Message.countDocuments({ receiverId: student.studentId, createdAt: { $gte: weekAgo } }),
      student.sectionId ? Routine.find({ sectionId: student.sectionId }).lean() : [],
      computeStudentResults(student),
    ]);

    // 1. attendance (present days / recorded days, same as the Attendance page)
    const present = attendance.filter((a: any) => a.status === "Present").length;
    const attendancePct = attendance.length ? Math.round((present / attendance.length) * 100) : 0;

    // attendance rate per month (last 9 months that have records)
    const months = new Map<string, { present: number; total: number }>();
    for (const a of attendance) {
      const d = new Date(a.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const cur = months.get(key) || { present: 0, total: 0 };
      cur.total += 1;
      if (a.status === "Present") cur.present += 1;
      months.set(key, cur);
    }
    const attendanceByMonth = [...months.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-9)
      .map(([key, v]) => ({ label: new Date(`${key}-01`).toLocaleDateString("en-US", { month: "short" }), value: Math.round((v.present / v.total) * 100) }));

    // 2. money due: unpaid fees that are not already paid and waiting for verification, plus unpaid fines
    const dueFees = fees.filter((f: any) => !f.transactionId);
    const feesTotal = dueFees.reduce((n: number, f: any) => n + (f.amount || 0), 0);
    const finesTotal = fines.reduce((n: number, f: any) => n + (f.amount || 0), 0);
    const grandTotal = feesTotal + finesTotal;
    let dueTrend = grandTotal ? "Pay from Fees & Payment" : "Nothing due";
    if (dueFees.length) {
      const nearest = [...dueFees].sort((a: any, b: any) => +new Date(a.dueDate) - +new Date(b.dueDate))[0];
      const diff = Math.ceil((+new Date(nearest.dueDate) - Date.now()) / 86400000);
      dueTrend = diff > 0 ? `Due in ${diff} day${diff > 1 ? "s" : ""}` : diff === 0 ? "Due today" : `Overdue by ${Math.abs(diff)} days`;
    }

    // 3. courses of the student's section (next class + how many of the 4 assessments already have marks)
    const courseIds = [...new Set(routines.map((r: any) => String(r.courseId)))];
    const [courses, teachers, marks, exams]: any[] = await Promise.all([
      Course.find({ _id: { $in: courseIds } }).lean(),
      Teacher.find({ _id: { $in: routines.map((r: any) => r.teacherId) } }).lean(),
      Mark.find({ studentId: idQuery, courseId: { $in: courseIds } }).select("courseId examType").lean(),
      Exam.find({ courseId: { $in: courseIds }, status: "Scheduled" }).sort({ date: 1 }).lean(),
    ]);

    const activeCourses = courses.map((course: any, idx: number) => {
      const classes = routines.filter((r: any) => String(r.courseId) === String(course._id)).sort((a: any, b: any) => daysUntil(a.day) - daysUntil(b.day) || a.startTime.localeCompare(b.startTime));
      const next = classes[0];
      const done = new Set(marks.filter((m: any) => String(m.courseId) === String(course._id)).map((m: any) => m.examType));
      const teacher = teachers.find((t: any) => String(t._id) === String(next?.teacherId));
      return {
        id: String(course._id),
        name: course.title,
        code: course.courseCode,
        teacher: teacher?.name || "",
        progress: Math.round((ASSESSMENTS.filter((a) => done.has(a)).length / ASSESSMENTS.length) * 100),
        nextClass: next ? `${daysUntil(next.day) === 0 ? "Today" : next.day}, ${next.startTime}` : "Not scheduled",
        color: COLORS[idx % COLORS.length],
      };
    });

    // 4. alerts: my notifications + urgent announcements
    const alerts = [
      ...notifications.map((n: any) => ({
        id: String(n._id),
        type: n.kind === "reminder" ? "warning" : "message",
        message: n.title,
        date: dateLabel(n.createdAt),
        ...(n.kind === "reminder"
          ? { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" }
          : { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" }),
      })),
      ...announcements.map((a: any) => ({
        id: String(a._id),
        type: "warning",
        message: a.title,
        date: dateLabel(a.createdAt),
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
      })),
    ];

    return NextResponse.json({
      student: { id: student.studentId, name: student.name, email: student.email, classId: student.classId, sectionId: student.sectionId },
      stats: {
        attendance: { value: `${attendancePct}%`, trend: attendance.length ? `${attendance.length} days recorded` : "No records yet" },
        cgpa: { value: results.cgpa.toFixed(2), trend: results.hasResults ? `${results.credits} credits` : "No marks yet" },
        feesDue: { value: `EGP ${grandTotal.toLocaleString()}`, trend: dueTrend },
        messages: { value: `${messagesWeek} New`, trend: "last 7 days" },
      },
      attendanceByMonth,
      alerts,
      courses: activeCourses,
      exams: exams.map((e: any) => {
        const course = courses.find((c: any) => String(c._id) === String(e.courseId));
        return {
          id: String(e._id),
          name: course ? `${course.title} Exam` : `Exam ${e.examId || ""}`,
          type: "Exam",
          startDate: e.date,
          endDate: e.date,
          session: e.time,
        };
      }),
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
