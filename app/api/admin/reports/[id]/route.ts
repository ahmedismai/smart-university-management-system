import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Report from "@/models/Report";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const report = await Report.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    return NextResponse.json(report);
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
    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
