import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/adminAuth";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import ApplicationDocument from "@/models/ApplicationDocument";
import { AdmissionError, enrollApplicant } from "@/lib/admissions";

const STATUSES = ["Pending", "Under Review", "Accepted", "Rejected"];

export async function GET() {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const applications: any[] = await Application.find().sort({ createdAt: -1 }).lean();
    const docs: any[] = await ApplicationDocument.find({ applicationId: { $in: applications.map((a) => a._id) } })
      .select("applicationId kind fileName size")
      .lean();
    const byApp = new Map<string, any[]>();
    for (const d of docs) {
      const key = String(d.applicationId);
      byApp.set(key, [...(byApp.get(key) || []), { id: String(d._id), kind: d.kind, fileName: d.fileName, size: d.size }]);
    }
    return NextResponse.json({
      success: true,
      applications: applications.map((a) => ({ ...a, documents: byApp.get(String(a._id)) || [] })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH { id, status, programCode?, decisionNote? }
// Accepting an application enrolls the applicant (student record + login) and
// returns their student ID and a one-time temporary password.
export async function PATCH(request: Request) {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { id, status, programCode, decisionNote } = await request.json();
    if (!id || !STATUSES.includes(status)) {
      return NextResponse.json({ error: "Valid id and status are required" }, { status: 400 });
    }
    const app: any = await Application.findById(id).lean().catch(() => null);
    if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });
    if (app.studentId && status !== "Accepted") {
      return NextResponse.json(
        { error: `This applicant is already enrolled as ${app.studentId}; the decision can no longer be changed.` },
        { status: 409 }
      );
    }

    const note = typeof decisionNote === "string" ? decisionNote.trim().slice(0, 1000) : undefined;
    if (note !== undefined) await Application.updateOne({ _id: id }, { decisionNote: note });

    let enrollment = null;
    if (status === "Accepted" && !app.studentId) {
      enrollment = await enrollApplicant(app, programCode || app.programCode);
    } else {
      await Application.updateOne({ _id: id }, { status });
    }

    const updated = await Application.findById(id).lean();
    return NextResponse.json({ success: true, application: updated, enrollment });
  } catch (error: any) {
    if (error instanceof AdmissionError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
