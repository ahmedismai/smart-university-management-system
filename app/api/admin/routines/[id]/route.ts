import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Routine from "@/models/Routine";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const routine = await Routine.findById(id)
      .populate("courseId", "title courseCode")
      .populate({
        path: "sectionId",
        select: "name sectionId classId",
        populate: { path: "classId", select: "name code" }
      })
      .populate("teacherId", "name department");
    if (!routine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }
    return NextResponse.json(routine);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const routine = await Routine.findByIdAndUpdate(id, body, {
      returnDocument: "after",
      runValidators: true,
    })
      .populate("courseId", "title courseCode")
      .populate({
        path: "sectionId",
        select: "name sectionId classId",
        populate: { path: "classId", select: "name code" }
      })
      .populate("teacherId", "name department");
    if (!routine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }
    return NextResponse.json(routine);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const routine = await Routine.findByIdAndDelete(id);
    if (!routine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Routine deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
