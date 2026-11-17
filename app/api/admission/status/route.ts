import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";

const hits = new Map<string, number[]>();

// Public: an applicant checks their decision with their application ID + email.
// POST is used so the email never ends up in a URL.
export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local";
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
    if (recent.length >= 10) {
      return NextResponse.json({ error: "Too many attempts, please wait a minute." }, { status: 429 });
    }
    hits.set(ip, [...recent, now]);

    const { applicationId, email } = await request.json();
    if (typeof applicationId !== "string" || typeof email !== "string" || !applicationId.trim() || !email.trim()) {
      return NextResponse.json({ error: "Application ID and email are required" }, { status: 400 });
    }

    await dbConnect();
    const app: any = await Application.findOne({
      applicationId: applicationId.trim().toUpperCase(),
      email: { $regex: `^${email.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    })
      .select("+passwordHash")
      .lean();
    if (!app) {
      return NextResponse.json(
        { error: "No application matches this ID and email. Please check both and try again." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      application: {
        applicationId: app.applicationId,
        fullName: app.fullName,
        program: app.department,
        submittedAt: app.createdAt,
        updatedAt: app.updatedAt,
        status: app.status,
        decisionNote: app.decisionNote || "",
        studentId: app.status === "Accepted" ? app.studentId || null : null,
        ownPassword: Boolean(app.passwordHash),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
