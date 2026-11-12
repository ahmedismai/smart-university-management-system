import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AttendancePolicy from "@/models/AttendancePolicy";

export async function GET() {
  try {
    await dbConnect();
    let policy = await AttendancePolicy.findOne();
    if (!policy) {
      // Create default policy if none exists
      policy = await AttendancePolicy.create({});
    }
    return NextResponse.json({ success: true, data: policy });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    let policy = await AttendancePolicy.findOne();
    if (policy) {
      policy = await AttendancePolicy.findByIdAndUpdate(policy._id, body, { new: true });
    } else {
      policy = await AttendancePolicy.create(body);
    }
    
    return NextResponse.json({ success: true, data: policy });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
