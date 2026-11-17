import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import ApplicationDocument, { APPLICATION_DOCUMENT_KINDS } from "@/models/ApplicationDocument";

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

// Public, token-protected: attach one document to a just-submitted application.
// multipart/form-data { applicationId, token, kind, file }
export async function POST(request: Request) {
  try {
    await dbConnect();
    const form = await request.formData();
    const applicationId = String(form.get("applicationId") || "");
    const token = String(form.get("token") || "");
    const kind = String(form.get("kind") || "");
    const file = form.get("file");

    if (!(APPLICATION_DOCUMENT_KINDS as readonly string[]).includes(kind)) {
      return NextResponse.json({ error: "Unknown document type" }, { status: 400 });
    }
    if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "File is required" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "File is too large (max 2MB)" }, { status: 400 });
    if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Only JPG, PNG, WEBP or PDF files are allowed" }, { status: 400 });

    const app: any = await Application.findOne({ applicationId })
      .select("+uploadToken +uploadTokenExpires")
      .lean();
    if (
      !app ||
      !token ||
      app.uploadToken !== token ||
      !app.uploadTokenExpires ||
      new Date(app.uploadTokenExpires).getTime() < Date.now()
    ) {
      return NextResponse.json({ error: "Upload link expired. Please contact the admissions office." }, { status: 403 });
    }

    await ApplicationDocument.findOneAndUpdate(
      { applicationId: app._id, kind },
      {
        fileName: file.name.slice(0, 200),
        mimeType: file.type,
        size: file.size,
        data: Buffer.from(await file.arrayBuffer()),
      },
      { upsert: true }
    );
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
