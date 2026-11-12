import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Class from "@/models/Class";
import Fee from "@/models/Fee";
import FeeHead from "@/models/FeeHead";
import Waiver from "@/models/Waiver";
import Fine from "@/models/Fine";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const studentSession = cookieStore.get("student_session")?.value;

    if (!studentSession) {
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    // Find the student document without populate
    const student = await Student.findOne({ studentId: studentSession }).lean();
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Manually fetch class info
    let classDoc: any = null;
    if (student.classId) {
      classDoc = await Class.findById(student.classId).lean();
    }

    const studentIdQuery = { $in: [student._id, student._id.toString()] };
    const deptCode = classDoc?.code || "CSE";
    const deptName = classDoc?.name || "Computer Science & Engineering";

    // Query fee records without populate
    const dbFeesRaw = await Fee.find({ studentId: studentIdQuery })
      .sort({ dueDate: -1 })
      .lean();

    // Manually populate feeHeadId for each fee
    const dbFees: any[] = [];
    for (const fee of dbFeesRaw) {
      let feeHeadDoc: any = null;
      if (fee.feeHeadId) {
        feeHeadDoc = await FeeHead.findById(fee.feeHeadId).lean();
      }
      dbFees.push({
        ...fee,
        feeHeadId: feeHeadDoc,
      });
    }

    const dbWaivers = await Waiver.find({ studentId: studentIdQuery })
      .sort({ createdAt: -1 })
      .lean();

    const dbFines = await Fine.find({ studentId: studentIdQuery })
      .sort({ createdAt: -1 })
      .lean();

    // Fees, fines and waivers of this student
    if (dbFees.length > 0 || dbFines.length > 0 || dbWaivers.length > 0) {
      // 1. Calculate Summary Stats
      const paidFeesAmount = dbFees
        .filter((f: any) => f.status === "Paid")
        .reduce((sum: number, f: any) => sum + f.amount, 0);

      const paidFinesAmount = dbFines
        .filter((f: any) => f.status === "Paid")
        .reduce((sum: number, f: any) => sum + f.amount, 0);

      const paidAmount = paidFeesAmount + paidFinesAmount;

      // a Pending fee that already has a transaction id was paid by the student and waits for the finance office
      const underReview = (f: any) => f.status === "Pending" && !!f.transactionId;
      const reviewAmount = dbFees.filter(underReview).reduce((sum: number, f: any) => sum + f.amount, 0);

      const dueFeesAmount = dbFees
        .filter((f: any) => (f.status === "Pending" || f.status === "Unpaid") && !underReview(f))
        .reduce((sum: number, f: any) => sum + f.amount, 0);

      const dueFinesAmount = dbFines
        .filter((f: any) => f.status === "Unpaid" || f.status === "Processing")
        .reduce((sum: number, f: any) => sum + f.amount, 0);

      const dueBalance = dueFeesAmount + dueFinesAmount;

      const waiversAmount = dbWaivers.reduce((sum: number, w: any) => sum + w.amount, 0);
      const totalPayable = paidAmount + dueBalance + reviewAmount;

      // 2. Transaction History
      const transactionHistory: any[] = [];
      dbFees
        .filter((f: any) => f.status === "Paid")
        .forEach((fee: any) => {
          transactionHistory.push({
            id: fee.transactionId || `#TX-${fee._id.toString().slice(-5).toUpperCase()}`,
            type: fee.feeHeadId?.name || "Semester Fee",
            method: fee.paymentMethod || "Vodafone Cash",
            date: fee.paidDate
              ? new Date(fee.paidDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
              : new Date(fee.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            amount: `EGP ${fee.amount.toLocaleString()}`,
            status: "Completed",
          });
        });

      dbFees
        .filter(underReview)
        .forEach((fee: any) => {
          transactionHistory.push({
            id: fee.transactionId,
            type: fee.feeHeadId?.name || "Semester Fee",
            method: fee.paymentMethod || "Vodafone Cash",
            date: new Date(fee.paidDate || fee.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            amount: `EGP ${fee.amount.toLocaleString()}`,
            status: "Under Review",
          });
        });

      dbFines
        .filter((f: any) => f.status === "Paid")
        .forEach((fine: any) => {
          transactionHistory.push({
            id: fine.fineId || `#FN-${fine._id.toString().slice(-5).toUpperCase()}`,
            type: `${fine.type} Fine`,
            method: "Bank Transfer",
            date: new Date(fine.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            amount: `EGP ${fine.amount.toLocaleString()}`,
            status: "Completed",
          });
        });

      // Sort transaction history by date descending
      transactionHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // 3. Upcoming Dues
      const upcomingFees: any[] = [];
      const today = new Date();

      dbFees
        .filter((f: any) => (f.status === "Pending" || f.status === "Unpaid") && !underReview(f))
        .forEach((fee: any) => {
          const dueDate = new Date(fee.dueDate);
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const urgent = diffDays <= 7;

          upcomingFees.push({
            id: fee._id.toString(),
            type: fee.feeHeadId?.name || "Semester Fee",
            amount: `EGP ${fee.amount.toLocaleString()}`,
            deadline: dueDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            urgent,
            rawAmount: fee.amount,
            itemType: "fee",
          });
        });

      dbFines
        .filter((f: any) => f.status === "Unpaid" || f.status === "Processing")
        .forEach((fine: any) => {
          const fineDate = new Date(fine.date || fine.createdAt || today);
          const dueDate = new Date(fineDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days after issue date
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const urgent = diffDays <= 3; // fines become urgent faster

          upcomingFees.push({
            id: fine._id.toString(),
            type: `${fine.type} Fine`,
            amount: `EGP ${fine.amount.toLocaleString()}`,
            deadline: dueDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            urgent,
            rawAmount: fine.amount,
            itemType: "fine",
          });
        });

      // Sort upcoming fees by deadline ascending
      upcomingFees.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

      // Get primary waiver text
      const primaryWaiverType = dbWaivers[0]?.type || "Academic Scholarship";

      const feeSummary = [
        { label: "Total Payable", value: `EGP ${totalPayable.toLocaleString()}`, sub: "Academic Year 2026", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Paid Amount", value: `EGP ${paidAmount.toLocaleString()}`, sub: transactionHistory[0] ? `Last payment: ${transactionHistory[0].date}` : "No payments made", color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Due Balance", value: `EGP ${dueBalance.toLocaleString()}`, sub: upcomingFees[0] ? `Next due: ${upcomingFees[0].deadline}` : "No upcoming dues", color: "text-red-600", bg: "bg-red-50" },
        { label: "Waivers", value: `EGP ${waiversAmount.toLocaleString()}`, sub: primaryWaiverType, color: "text-purple-600", bg: "bg-purple-50" },
      ];

      return NextResponse.json({
        success: true,
        student: {
          name: student.name,
          studentId: student.studentId,
          deptCode,
          deptName,
        },
        feeSummary,
        transactionHistory,
        upcomingFees,
      });
    }

    // Nothing billed yet: show real zeros (no sample data)
    const zero = (label: string, sub: string, color: string, bg: string) => ({ label, value: "EGP 0", sub, color, bg });
    return NextResponse.json({
      success: true,
      student: { name: student.name, studentId: student.studentId, deptCode, deptName },
      feeSummary: [
        zero("Total Payable", "No fees yet", "text-blue-600", "bg-blue-50"),
        zero("Paid Amount", "No payments made", "text-emerald-600", "bg-emerald-50"),
        zero("Due Balance", "No upcoming dues", "text-red-600", "bg-red-50"),
        zero("Waivers", "None", "text-purple-600", "bg-purple-50"),
      ],
      transactionHistory: [],
      upcomingFees: [],
    });
  } catch (error: any) {
    console.error("Student Fees GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const studentSession = cookieStore.get("student_session")?.value;

    if (!studentSession) {
      return NextResponse.json({ error: "Unauthorized: No active session" }, { status: 401 });
    }

    const student = await Student.findOne({ studentId: studentSession }).lean();
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const { id, itemType, paymentMethod } = await request.json();
    if (!id || !itemType || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const txId = `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Process the database update
    if (itemType === "fee") {
      const fee = await Fee.findById(id);
      if (!fee) {
        return NextResponse.json({ error: "Fee record not found" }, { status: 404 });
      }
      const instant = ["Visa", "MasterCard"].includes(paymentMethod);
      fee.status = instant ? "Paid" : "Pending"; // wallets and bank transfers are confirmed by the finance office
      fee.paymentMethod = paymentMethod;
      fee.transactionId = txId;
      fee.paidDate = new Date();
      await fee.save();
      if (!instant) {
        return NextResponse.json({
          success: true,
          pendingReview: true,
          message: "Payment submitted. It will show as paid once the finance office verifies it.",
          transactionId: txId,
        });
      }
    } else if (itemType === "fine") {
      const fine = await Fine.findById(id);
      if (!fine) {
        return NextResponse.json({ error: "Fine record not found" }, { status: 404 });
      }
      fine.status = "Paid";
      fine.date = new Date();
      await fine.save();
    } else {
      return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
      transactionId: txId,
    });
  } catch (error: any) {
    console.error("Student Fees POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
