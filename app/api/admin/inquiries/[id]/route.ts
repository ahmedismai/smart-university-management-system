import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminContext } from "@/lib/adminAuth";
import Inquiry from "@/models/Inquiry";
import User from "@/models/User";
import Student from "@/models/Student";

const DEFAULT_PASSWORD = "Student@123";

// PATCH { status?, adminNote?, action? }  action: "reset-password" | "deactivate-student" | "approve-leave"
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const { status, adminNote, action } = await request.json();
    const doc: any = await Inquiry.findById(id);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let message = "";
    if (action === "reset-password") {
      const ref = String(doc.userRef || doc.meta?.userId || "").trim();
      const user: any = doc.email ? await User.findOne({ email: doc.email }) : null;
      if (!user) return NextResponse.json({ error: "No account matches this request's email" }, { status: 404 });
      user.password = await bcrypt.hash(DEFAULT_PASSWORD, 10);
      await user.save();
      doc.status = "Resolved";
      message = `Password for ${user.email}${ref ? ` (${ref})` : ""} reset to the default password.`;
    } else if (action === "deactivate-student") {
      const s: any = await Student.findOne({ studentId: doc.userRef });
      if (!s) return NextResponse.json({ error: "Student not found" }, { status: 404 });
      s.status = "Inactive";
      await s.save();
      doc.status = "Resolved";
      message = `${s.name} was deactivated.`;
    } else {
      if (status) doc.status = status;
    }
    if (typeof adminNote === "string") doc.adminNote = adminNote.slice(0, 1000);
    await doc.save();
    return NextResponse.json({ success: true, item: doc, message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await Inquiry.deleteOne({ _id: id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
