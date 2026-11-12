import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/models/Result";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const result = await Result.findById(id).populate("courseId");
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }
    return NextResponse.json(result);
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
    const result = await Result.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }
    return NextResponse.json(result);
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
    const result = await Result.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Result deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
