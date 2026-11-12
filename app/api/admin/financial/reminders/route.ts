import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getAdminContext } from "@/lib/adminAuth";
import Fee from "@/models/Fee";
import Notification from "@/models/Notification";

// POST -> sends an in-app reminder to every student with overdue unpaid invoices
// (at most one reminder per student per day).
export async function POST() {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const now = new Date();
    const overdue: any[] = await Fee.find({ status: { $in: ["Pending", "Failed"] }, dueDate: { $lt: now } }).lean();
    if (!overdue.length) return NextResponse.json({ success: true, students: 0, invoices: 0, message: "No overdue invoices" });

    const byStudent = new Map<string, { count: number; total: number }>();
    for (const f of overdue) {
      const key = String(f.studentId);
      const cur = byStudent.get(key) || { count: 0, total: 0 };
      cur.count += 1;
      cur.total += f.amount || 0;
      byStudent.set(key, cur);
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const alreadyToday: any[] = await Notification.find({ kind: "reminder", createdAt: { $gte: startOfDay }, studentId: { $in: [...byStudent.keys()] } })
      .select("studentId")
      .lean();
    const skip = new Set(alreadyToday.map((n) => String(n.studentId)));

    const docs = [...byStudent.entries()]
      .filter(([id]) => !skip.has(id))
      .map(([studentId, v]) => ({
        studentId,
        kind: "reminder",
        title: `Payment reminder: ${v.count} overdue invoice${v.count > 1 ? "s" : ""}`,
        body: `You have EGP ${v.total.toLocaleString()} overdue. Please pay from Fees & Payment.`,
        link: "/student/fees",
      }));
    if (docs.length) await Notification.insertMany(docs);

    return NextResponse.json({
      success: true,
      students: docs.length,
      invoices: overdue.length,
      skipped: skip.size,
      message: docs.length
        ? `Reminders sent to ${docs.length} student${docs.length > 1 ? "s" : ""} (${overdue.length} overdue invoices)`
        : "Everyone with overdue invoices was already reminded today",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
