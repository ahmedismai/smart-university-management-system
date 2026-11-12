import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getAdminContext } from "@/lib/adminAuth";
import Staff from "@/models/Staff";

export async function GET(request: Request) {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const staff = await Staff.find().sort({ createdAt: -1 });
    return NextResponse.json(staff);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const body = await request.json();
    const staff = await Staff.create(body);
    return NextResponse.json(staff, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
