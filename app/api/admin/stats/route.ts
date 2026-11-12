import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import Class from "@/models/Class";
import Fee from "@/models/Fee";

export async function GET() {
  try {
    await dbConnect();

    const [studentCount, teacherCount, classCount, feeStats] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Class.countDocuments(),
      Fee.aggregate([
        {
          $group: {
            _id: null,
            totalCollected: {
              $sum: { $cond: [{ $eq: ["$status", "Paid"] }, "$amount", 0] },
            },
            totalPending: {
              $sum: { $cond: [{ $eq: ["$status", "Pending"] }, "$amount", 0] },
            },
          },
        },
      ]),
    ]);

    const collected = feeStats[0]?.totalCollected || 0;
    const pending = feeStats[0]?.totalPending || 0;
    const target = collected + pending || 1; // Avoid division by zero

    return NextResponse.json({
      students: studentCount,
      teachers: teacherCount,
      classes: classCount,
      fees: {
        collected,
        pending,
        percentage: Math.round((collected / target) * 100),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
