import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Routine from "@/models/Routine";
import Course from "@/models/Course";
import Section from "@/models/Section";
import Teacher from "@/models/Teacher";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const routines = await Routine.find({})
      .populate("courseId", "title courseCode")
      .populate({
        path: "sectionId",
        select: "name sectionId classId",
        populate: { path: "classId", select: "name code" }
      })
      .populate("teacherId", "name department");
    return NextResponse.json(routines);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Simple conflict check (Room/Teacher/Section on same Day/Time)
    // For now, we'll just create it, but in a real app, we'd check overlaps.
    
    const routine = await Routine.create(body);
    const populated = await Routine.findById(routine._id)
      .populate("courseId", "title courseCode")
      .populate({
        path: "sectionId",
        select: "name sectionId classId",
        populate: { path: "classId", select: "name code" }
      })
      .populate("teacherId", "name department");
      
    return NextResponse.json(populated, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
