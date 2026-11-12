import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Holiday from "@/models/Holiday";

export async function GET() {
  try {
    await dbConnect();
    const holidays = await Holiday.find().sort({ startDate: 1 });
    return NextResponse.json({ success: true, data: holidays });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const holiday = await Holiday.create(body);
    return NextResponse.json({ success: true, data: holiday });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    
    await Holiday.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
