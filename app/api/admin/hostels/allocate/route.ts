import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getAdminContext } from "@/lib/adminAuth";
import Hostel from "@/models/Hostel";
import Student from "@/models/Student";

// POST { studentId, hostelId } -> assigns the student a bed (moves them if they already had one)
export async function POST(request: Request) {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { studentId, hostelId } = await request.json();
    if (!studentId || !hostelId) return NextResponse.json({ error: "Student ID and hostel are required" }, { status: 400 });

    const student: any = await Student.findOne({ studentId: String(studentId).trim().toUpperCase() });
    if (!student) return NextResponse.json({ error: `No student found with ID ${studentId}` }, { status: 404 });
    const hostel: any = await Hostel.findById(hostelId).catch(() => null);
    if (!hostel) return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    if (hostel.status === "Maintenance") return NextResponse.json({ error: "This hostel is under maintenance" }, { status: 400 });
    if (String(student.hostelId || "") === String(hostel._id)) {
      return NextResponse.json({ error: `${student.name} already lives in ${hostel.name}` }, { status: 409 });
    }
    if (hostel.occupied >= hostel.capacity) return NextResponse.json({ error: `${hostel.name} is full` }, { status: 409 });

    // free the previous bed
    if (student.hostelId) {
      const old: any = await Hostel.findById(student.hostelId);
      if (old) {
        old.occupied = Math.max(0, old.occupied - 1);
        if (old.status === "Full") old.status = "Available";
        await old.save();
      }
    }
    hostel.occupied += 1;
    if (hostel.occupied >= hostel.capacity) hostel.status = "Full";
    await hostel.save();
    student.hostelId = hostel._id;
    await student.save();

    return NextResponse.json({ success: true, message: `${student.name} allocated to ${hostel.name}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
