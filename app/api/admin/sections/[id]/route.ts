import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Section from "@/models/Section";
import Class from "@/models/Class";
import Teacher from "@/models/Teacher";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const section = await Section.findById(id)
      .populate("classId", "name code")
      .populate("teacherId", "name department");
    
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    return NextResponse.json(section);
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
    const section = await Section.findByIdAndUpdate(id, body, {
      returnDocument: "after",
      runValidators: true,
    })
      .populate("classId", "name code")
      .populate("teacherId", "name department");
    
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    return NextResponse.json(section);
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
    const section = await Section.findByIdAndDelete(id);
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Section deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
