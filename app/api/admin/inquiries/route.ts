import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/adminAuth";
import Inquiry from "@/models/Inquiry";

export async function GET(request: Request) {
  try {
    if (!(await getAdminContext())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const query: any = {};
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    if (type) query.type = type;
    if (status) query.status = status;
    const items = await Inquiry.find(query).sort({ createdAt: -1 }).limit(500).lean();
    const counts = await Inquiry.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]);
    return NextResponse.json({ success: true, items, counts: Object.fromEntries(counts.map((c: any) => [c._id, c.n])) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
