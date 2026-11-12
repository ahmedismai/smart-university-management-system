import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Class from "@/models/Class";
import Teacher from "@/models/Teacher";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const classItem = await Class.findById(id).populate("teacherId", "name department");
    if (!classItem) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }
    return NextResponse.json(classItem);
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
    const classItem = await Class.findByIdAndUpdate(id, body, {
      returnDocument: "after",
      runValidators: true,
    }).populate("teacherId", "name department");
    
    if (!classItem) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }
    return NextResponse.json(classItem);
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
    const classItem = await Class.findByIdAndDelete(id);
    if (!classItem) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Class deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
