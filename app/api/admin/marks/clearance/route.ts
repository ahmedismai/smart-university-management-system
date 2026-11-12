import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getAdminContext } from "@/lib/adminAuth";
import Student from "@/models/Student";
import Fee from "@/models/Fee";
import Fine from "@/models/Fine";
import BookIssue from "@/models/BookIssue";
import Mark from "@/models/Mark";

// GET -> clearance status of every active student (needed before a final transcript is issued):
// no unpaid fees or fines, no library book still out, and at least one result.
export async function GET() {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const students: any[] = await Student.find({ status: "Active" }).sort({ studentId: 1 }).lean();
    const ids = students.map((s) => s._id);
    const [fees, fines, issues, marked]: any[] = await Promise.all([
      Fee.find({ studentId: { $in: ids }, status: { $in: ["Pending", "Failed", "Unpaid"] }, $or: [{ transactionId: { $exists: false } }, { transactionId: "" }] }).select("studentId amount").lean(),
      Fine.find({ studentId: { $in: ids }, status: "Unpaid" }).select("studentId amount").lean(),
      BookIssue.find({ memberId: { $in: students.map((s) => s.studentId) }, status: { $in: ["Active", "Overdue"] } }).select("memberId").lean(),
      Mark.distinct("studentId", { studentId: { $in: ids } }),
    ]);

    const sum = (rows: any[], id: any) => rows.filter((r) => String(r.studentId) === String(id)).reduce((n, r) => n + (r.amount || 0), 0);
    const rows = students.map((s) => {
      const dues = sum(fees, s._id) + sum(fines, s._id);
      const books = issues.filter((i: any) => i.memberId === s.studentId).length;
      const hasResults = marked.some((m: any) => String(m) === String(s._id));
      const reasons = [dues ? `EGP ${dues.toLocaleString()} unpaid` : "", books ? `${books} book${books > 1 ? "s" : ""} not returned` : "", hasResults ? "" : "no results yet"].filter(Boolean);
      return { studentId: s.studentId, name: s.name, cleared: reasons.length === 0, reasons };
    });
    return NextResponse.json({ success: true, cleared: rows.filter((r) => r.cleared).length, total: rows.length, students: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
