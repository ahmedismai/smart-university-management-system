import { NextResponse } from "next/server";
import { getStudentContext } from "@/lib/studentAuth";
import StudentDocument from "@/models/StudentDocument";

// Download one of my documents
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const student = await getStudentContext();
    if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const doc: any = await StudentDocument.findOne({ _id: id, studentId: student._id }).lean().catch(() => null);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const bytes = Buffer.from(doc.data.buffer ?? doc.data);
    return new Response(bytes, {
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Length": String(bytes.length),
        "Content-Disposition": "attachment; filename*=UTF-8''" + encodeURIComponent(doc.fileName),
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const student = await getStudentContext();
    if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const res = await StudentDocument.deleteOne({ _id: id, studentId: student._id }).catch(() => ({ deletedCount: 0 }));
    if (!res.deletedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
