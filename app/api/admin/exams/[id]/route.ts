import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Exam from "@/models/Exam";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const exam = await Exam.findById(id).populate("courseId", "title courseCode");
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }
    return NextResponse.json(exam);
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
    const exam = await Exam.findByIdAndUpdate(id, body, {
      returnDocument: "after",
      runValidators: true,
    }).populate("courseId", "title courseCode");
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }
    return NextResponse.json(exam);
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
    const exam = await Exam.findByIdAndDelete(id);
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Exam deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
