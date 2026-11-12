import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import GradeScale from "@/models/GradeScale";

export async function GET() {
  try {
    await dbConnect();
    const scales = await GradeScale.find().sort({ min: -1 });
    return NextResponse.json(scales);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const scale = await GradeScale.create(body);
    return NextResponse.json(scale, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;
    const scale = await GradeScale.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(scale);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await GradeScale.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
