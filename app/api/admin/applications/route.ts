import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";

const STATUSES = ["Pending", "Under Review", "Accepted", "Rejected"];

async function isAdmin() {
  return !!(await cookies()).get("admin_session");
}

export async function GET() {
  try {
    await dbConnect();
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const applications = await Application.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH { id, status }
export async function PATCH(request: Request) {
  try {
    await dbConnect();
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id, status } = await request.json();
    if (!id || !STATUSES.includes(status)) {
      return NextResponse.json({ error: "Valid id and status are required" }, { status: 400 });
    }
    const updated = await Application.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: "Application not found" }, { status: 404 });
    return NextResponse.json({ success: true, application: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
