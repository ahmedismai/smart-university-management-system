import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Fee from "@/models/Fee";
import Student from "@/models/Student";
import FeeHead from "@/models/FeeHead";
import Notification from "@/models/Notification";
import { getAdminContext } from "@/lib/adminAuth";

export async function GET() {
  try {
    await dbConnect();

    // Fetch paid and failed fees (transactions)
    // Paid / failed payments, plus pending ones that the student already paid (they carry a transaction id)
    const transactions = await Fee.find({
      $or: [{ status: { $in: ["Paid", "Failed"] } }, { status: "Pending", transactionId: { $exists: true, $ne: "" } }],
    })
    .populate("studentId", "name studentId")
    .populate({ path: "feeHeadId", select: "name", strictPopulate: false })
    .sort({ updatedAt: -1 });

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));

    // Calculate stats
    const todayCollection = transactions
      .filter((t: any) => t.status === "Paid" && new Date(t.updatedAt) >= startOfToday)
      .reduce((acc: number, t: any) => acc + t.amount, 0);

    const totalTransactions = transactions.length;
    const pendingVerification = transactions.filter((t: any) => t.status === "Pending").length;

    const stats = [
      { label: "Today's Collection", value: `EGP ${todayCollection.toLocaleString()}`, icon: "DollarSign", color: "bg-emerald-500" },
      { label: "Total Transactions", value: totalTransactions.toLocaleString(), icon: "Zap", color: "bg-blue-500" },
      { label: "Pending Verification", value: pendingVerification.toLocaleString(), icon: "Clock", color: "bg-amber-500" },
      { label: "Refund Requests", value: "0", icon: "RefreshCcw", color: "bg-red-500" },
    ];

    // Method Breakdown
    const methodCounts: { [key: string]: number } = {};
    let totalPaid = 0;
    transactions.forEach((t: any) => {
      if (t.status === "Paid") {
        const method = t.paymentMethod || "Bank Transfer";
        methodCounts[method] = (methodCounts[method] || 0) + 1;
        totalPaid++;
      }
    });

    const methodBreakdown = Object.keys(methodCounts).map(name => ({
      name,
      value: totalPaid > 0 ? Math.round((methodCounts[name] / totalPaid) * 100) : 0,
      color: name.includes("MFS") || name.includes("Vodafone Cash") ? "bg-primary" : "bg-blue-500"
    })).sort((a, b) => b.value - a.value);

    return NextResponse.json({
      payments: transactions.map((t: any) => ({
        feeId: String(t._id),
        id: t.transactionId || `TXN-${t._id.toString().slice(-5).toUpperCase()}`,
        student: t.studentId?.name || "Unknown",
        amount: t.amount.toLocaleString(),
        method: t.paymentMethod || "Bank Transfer",
        date: new Date(t.updatedAt).toLocaleString('en-US', { 
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', hour12: true 
        }),
        status: t.status === "Paid" ? "Success" : t.status,
        type: t.feeHeadId?.name || "Fee"
      })),
      stats,
      methodBreakdown
    });
  } catch (error: any) {
    console.error("Payments API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH { action: "approve" | "reject", ids?: string[], all?: boolean }
// Verifies payments that are waiting for review and tells each student the result.
export async function PATCH(request: Request) {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { action, ids, all } = await request.json();
    if (action !== "approve" && action !== "reject") return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    const query: any = { status: "Pending" };
    if (!all) {
      if (!Array.isArray(ids) || !ids.length) return NextResponse.json({ error: "Select at least one payment" }, { status: 400 });
      query._id = { $in: ids };
    }
    const fees: any[] = await Fee.find(query).populate({ path: "feeHeadId", select: "name", strictPopulate: false });
    if (!fees.length) return NextResponse.json({ error: "No pending payments found" }, { status: 404 });

    for (const f of fees) {
      if (action === "approve") {
        f.status = "Paid";
        f.paidDate = new Date();
        if (!f.transactionId) f.transactionId = `TXN-${String(f._id).slice(-6).toUpperCase()}`;
        if (!f.paymentMethod) f.paymentMethod = "Bank Transfer";
      } else {
        f.status = "Failed";
      }
      await f.save();
      const name = f.feeHeadId?.name || "Fee";
      await Notification.create({
        studentId: f.studentId,
        kind: "payment",
        title: action === "approve" ? `Payment confirmed: ${name}` : `Payment rejected: ${name}`,
        body:
          action === "approve"
            ? `Your payment of EGP ${f.amount.toLocaleString()} was verified. Transaction ${f.transactionId}.`
            : `Your payment of EGP ${f.amount.toLocaleString()} could not be verified. Please pay again or contact the finance office.`,
        link: "/student/fees",
      });
    }
    return NextResponse.json({ success: true, updated: fees.length, message: `${fees.length} payment${fees.length > 1 ? "s" : ""} ${action === "approve" ? "approved" : "rejected"}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
