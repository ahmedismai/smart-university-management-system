import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";

const TYPES = ["contact", "apply", "subscribe", "registration", "leave", "deactivation", "password-reset", "other"];
const hits = new Map<string, number[]>();

// Public endpoint: stores a request/inquiry. Light per-client rate limit (8 / minute).
export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local";
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
    if (recent.length >= 8) return NextResponse.json({ error: "Too many requests, please wait a minute." }, { status: 429 });
    hits.set(ip, [...recent, now]);

    const body = await request.json();
    const clean = (v: any, max = 2000) => String(v ?? "").trim().slice(0, max);
    const type = TYPES.includes(body.type) ? body.type : "contact";
    const subject = clean(body.subject, 200);
    let name = clean(body.name, 120);
    let email = clean(body.email, 200).toLowerCase();
    const phone = clean(body.phone, 40);
    const message = clean(body.message);
    if (!subject) return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Invalid email address" }, { status: 400 });

    // Attach the logged-in user, if any (trusted over what the form says)
    await dbConnect();
    const jar = await cookies();
    let userRole = "";
    let userRef = "";
    const studentId = jar.get("student_session")?.value;
    const teacherId = jar.get("teacher_session")?.value;
    if (studentId) {
      const s: any = await Student.findOne({ studentId }).lean();
      if (s) {
        userRole = "Student";
        userRef = s.studentId;
        name = name || s.name;
        email = email || s.email;
      }
    } else if (teacherId) {
      const t: any = await Teacher.findOne({ teacherId }).lean();
      if (t) {
        userRole = "Teacher";
        userRef = t.teacherId;
        name = name || t.name;
        email = email || t.email;
      }
    }

    if (!userRole && !email && !phone) {
      return NextResponse.json({ error: "Please provide an email or phone number" }, { status: 400 });
    }

    const meta = body.meta && typeof body.meta === "object" ? JSON.parse(JSON.stringify(body.meta).slice(0, 4000)) : {};
    const doc = await Inquiry.create({
      type,
      subject,
      name,
      email,
      phone,
      message,
      meta,
      pagePath: clean(body.pagePath, 300),
      userRole,
      userRef,
    });
    return NextResponse.json({ success: true, id: String(doc._id) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
