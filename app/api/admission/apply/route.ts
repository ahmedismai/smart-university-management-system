import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";

const FIELDS = [
  "fullName", "email", "phone", "dob", "address",
  "sscInstitution", "sscYear", "sscGpa", "hscInstitution", "hscYear", "hscGpa",
  "faculty", "department",
] as const;

// Public: submit an admission application
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const data: Record<string, string> = {};
    for (const f of FIELDS) {
      if (typeof body[f] === "string") data[f] = body[f].trim().slice(0, 500);
    }

    if (!data.fullName) return NextResponse.json({ error: "Full name is required (step 1)" }, { status: 400 });
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
      return NextResponse.json({ error: "A valid email is required (step 1)" }, { status: 400 });
    }
    if (!data.department) return NextResponse.json({ error: "Please choose a department (step 3)" }, { status: 400 });

    const year = new Date().getFullYear();
    const count = await Application.countDocuments();
    const applicationId = `APP-${year}-${String(count + 1).padStart(5, "0")}`;

    await Application.create({ ...data, applicationId });
    return NextResponse.json({ success: true, applicationId }, { status: 201 });
  } catch (error: any) {
    console.error("Admission Apply Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin only: list applications
export async function GET() {
  try {
    await dbConnect();
    if (!(await cookies()).get("admin_session")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const applications = await Application.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
