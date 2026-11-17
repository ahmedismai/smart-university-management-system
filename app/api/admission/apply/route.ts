import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import ClassModel from "@/models/Class";

const FIELDS = [
  "fullName", "email", "phone", "nationalId", "dob", "address",
  "sscInstitution", "sscYear", "sscGpa", "hscInstitution", "hscYear", "hscGpa",
  "faculty", "programCode",
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
    if (data.email) data.email = data.email.toLowerCase();

    if (!data.fullName) return NextResponse.json({ error: "Full name is required (step 1)" }, { status: 400 });
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
      return NextResponse.json({ error: "A valid email is required (step 1)" }, { status: 400 });
    }
    if (data.nationalId && !/^\d{14}$/.test(data.nationalId)) {
      return NextResponse.json({ error: "National ID must be 14 digits (step 1)" }, { status: 400 });
    }

    const password = typeof body.password === "string" ? body.password : "";
    if (password.length < 8) {
      return NextResponse.json({ error: "Please create a password of at least 8 characters (step 1)" }, { status: 400 });
    }

    const program: any = data.programCode ? await ClassModel.findOne({ code: data.programCode }).lean() : null;
    if (!program) return NextResponse.json({ error: "Please choose a program (step 3)" }, { status: 400 });

    const open: any = await Application.findOne({
      email: data.email,
      status: { $in: ["Pending", "Under Review"] },
    }).lean();
    if (open) {
      return NextResponse.json(
        { error: `You already have an application under review (${open.applicationId}). Check its status from the Application Status page.` },
        { status: 409 }
      );
    }

    const year = new Date().getFullYear();
    const uploadToken = crypto.randomBytes(24).toString("hex");
    let created: any = null;
    for (let attempt = 0; attempt < 3 && !created; attempt++) {
      const count = await Application.countDocuments();
      const applicationId = `APP-${year}-${String(count + 1 + attempt).padStart(5, "0")}`;
      try {
        created = await Application.create({
          ...data,
          department: program.name,
          programCode: program.code,
          applicationId,
          passwordHash: await bcrypt.hash(password, 10),
          uploadToken,
          uploadTokenExpires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        });
      } catch (e: any) {
        if (e?.code !== 11000) throw e;
      }
    }
    if (!created) throw new Error("Could not create the application, please try again");

    return NextResponse.json(
      { success: true, applicationId: created.applicationId, uploadToken },
      { status: 201 }
    );
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
