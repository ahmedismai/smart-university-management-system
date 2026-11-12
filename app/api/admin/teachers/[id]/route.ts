import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Teacher from "@/models/Teacher";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    return NextResponse.json(teacher);
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
    const teacher = await Teacher.findByIdAndUpdate(id, body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    return NextResponse.json(teacher);
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
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
