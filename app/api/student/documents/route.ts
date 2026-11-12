import { NextResponse } from "next/server";
import { getStudentContext } from "@/lib/studentAuth";
import StudentDocument from "@/models/StudentDocument";

const MAX_SIZE = 4 * 1024 * 1024; // Vercel serverless request bodies are limited to 4.5MB
const TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

export async function GET() {
  try {
    const student = await getStudentContext();
    if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const docs: any[] = await StudentDocument.find({ studentId: student._id }).select("-data").sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      documents: docs.map((d) => ({ id: String(d._id), fileName: d.fileName, size: d.size, createdAt: d.createdAt })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST multipart/form-data { file }
export async function POST(request: Request) {
  try {
    const student = await getStudentContext();
    if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const file = (await request.formData()).get("file");
    if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "File is required" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "File is too large (max 4MB)" }, { status: 400 });
    const mimeType = TYPES[(file.name.split(".").pop() || "").toLowerCase()];
    if (!mimeType) return NextResponse.json({ error: "Allowed types: PDF, DOC, DOCX, JPG, PNG" }, { status: 400 });
    if ((await StudentDocument.countDocuments({ studentId: student._id })) >= 20) {
      return NextResponse.json({ error: "You can store up to 20 documents. Delete one first." }, { status: 400 });
    }
    const doc = await StudentDocument.create({
      studentId: student._id,
      fileName: file.name,
      mimeType,
      size: file.size,
      data: Buffer.from(await file.arrayBuffer()),
    });
    return NextResponse.json({ success: true, id: String(doc._id) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
