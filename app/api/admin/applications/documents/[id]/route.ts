import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/adminAuth";
import ApplicationDocument from "@/models/ApplicationDocument";

// Admin only: open an applicant's uploaded document
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const doc: any = await ApplicationDocument.findById(id).lean().catch(() => null);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const bytes = Buffer.from(doc.data.buffer ?? doc.data);
    return new Response(bytes, {
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Length": String(bytes.length),
        "Content-Disposition": "inline; filename*=UTF-8''" + encodeURIComponent(doc.fileName),
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
