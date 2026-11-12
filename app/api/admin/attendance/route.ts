import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";
import Class from "@/models/Class";

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Get search params for filtering if needed
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split('T')[0];

    // Fetch attendance records for the date
    // We start by finding all records for the given date
    // Note: The date in the database might be stored as a full Date object
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    })
    .populate({
      path: 'studentId',
      model: Student,
      select: 'name studentId classId'
    })
    .populate({
      path: 'classId',
      model: Class,
      select: 'name code'
    })
    .sort({ createdAt: -1 });

    // Calculate stats
    const totalStudents = await Student.countDocuments({ status: "Active" });
    const presentCount = await Attendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: "Present"
    });
    const lateCount = await Attendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: "Late"
    });
    const absentCount = await Attendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: "Absent"
    });

    return NextResponse.json({
      success: true,
      data: records,
      stats: {
        totalStudents,
        present: presentCount,
        late: lateCount,
        absent: absentCount,
        leave: 0 // Placeholder for now
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const { studentId, classId, status, date, remark } = body;
    
    if (!studentId || !classId || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const attendance = await Attendance.create({
      studentId,
      classId,
      status,
      date: date || new Date(),
      remark
    });

    const populatedRecord = await Attendance.findById(attendance._id)
      .populate({
        path: 'studentId',
        model: Student,
        select: 'name studentId classId'
      })
      .populate({
        path: 'classId',
        model: Class,
        select: 'name code'
      });

    return NextResponse.json({
      success: true,
      data: populatedRecord
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
